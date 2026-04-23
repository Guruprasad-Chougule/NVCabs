// src/app/api/admin/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function isAdmin(req: NextRequest) {
  const user = await getAuthUser(req);
  return user && ['admin', 'super_admin'].includes(user.role);
}

const vehicleSchema = z.object({
  type: z.enum(['sedan', 'suv', 'innova', 'tempo_traveller', 'mini_bus']),
  make: z.string().min(2).max(50),
  model: z.string().min(2).max(50),
  registrationNo: z.string().min(5).max(20),
  capacity: z.number().int().min(1).max(50),
  ac: z.boolean().default(true),
  ratePerKm: z.number().positive(),
  ratePerDay: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  const vehicles = await prisma.vehicle.findMany({ orderBy: { type: 'asc' } });
  return NextResponse.json({ success: true, data: vehicles });
}

export async function POST(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  const data = vehicleSchema.parse(await req.json());
  const vehicle = await prisma.vehicle.create({ data });
  return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: { code: 'MISSING_ID' } }, { status: 400 });
  const data = vehicleSchema.partial().parse(await req.json());
  const vehicle = await prisma.vehicle.update({ where: { id }, data });
  return NextResponse.json({ success: true, data: vehicle });
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: { code: 'MISSING_ID' } }, { status: 400 });
  await prisma.vehicle.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true, data: { message: 'Vehicle deactivated' } });
}
