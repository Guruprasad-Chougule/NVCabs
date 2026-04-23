// src/app/api/admin/pricing-rules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function isAdmin(req: NextRequest) {
  const user = await getAuthUser(req);
  return user && ['admin', 'super_admin'].includes(user.role);
}

export async function GET(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  const rules = await prisma.pricingRule.findMany({ orderBy: [{ vehicleType: 'asc' }, { tripType: 'asc' }] });
  return NextResponse.json({ success: true, data: rules });
}

const updateSchema = z.object({
  baseFare: z.number().positive().optional(),
  perKmRate: z.number().positive().optional(),
  nightSurcharge: z.number().min(0).optional(),
  driverBatta: z.number().min(0).optional(),
  gstPercent: z.number().min(0).optional(),
});

export async function PUT(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: { code: 'MISSING_ID' } }, { status: 400 });
  const data = updateSchema.parse(await req.json());
  const rule = await prisma.pricingRule.update({ where: { id }, data });
  return NextResponse.json({ success: true, data: rule });
}
