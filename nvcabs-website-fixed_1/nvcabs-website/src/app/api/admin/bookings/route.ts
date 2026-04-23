// src/app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function isAdmin(req: NextRequest) {
  const user = await getAuthUser(req);
  return user && ['admin', 'super_admin'].includes(user.role) ? user : null;
}

export async function GET(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { bookingRef: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { phone: { contains: search } } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, phone: true, email: true } },
        driver: { include: { user: { select: { name: true, phone: true } } } },
        vehicle: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({ success: true, data: bookings, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

const updateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled']).optional(),
  driverId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  finalFare: z.number().positive().optional(),
  paymentStatus: z.enum(['unpaid', 'partial', 'paid', 'refunded']).optional(),
});

export async function PUT(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: { code: 'MISSING_ID' } }, { status: 400 });

  const body = await req.json();
  const data = updateSchema.parse(body);

  const booking = await prisma.booking.update({ where: { id }, data });
  return NextResponse.json({ success: true, data: booking });
}
