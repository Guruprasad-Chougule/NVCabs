// src/app/api/admin/drivers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function isAdmin(req: NextRequest) {
  const user = await getAuthUser(req);
  return user && ['admin', 'super_admin'].includes(user.role);
}

export async function GET(req: NextRequest) {
  if (!await isAdmin(req)) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        user: { select: { name: true, phone: true, email: true } },
        vehicle: { select: { type: true, model: true, registrationNo: true } },
      },
      orderBy: { rating: 'desc' },
    });
    return NextResponse.json({ success: true, data: drivers });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch drivers' } },
      { status: 500 }
    );
  }
}
