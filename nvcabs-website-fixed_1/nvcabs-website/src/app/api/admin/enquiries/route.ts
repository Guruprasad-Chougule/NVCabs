// src/app/api/admin/enquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function isAdmin(req: NextRequest) {
  const user = await getAuthUser(req);
  return user && ['admin', 'super_admin'].includes(user.role);
}

export async function GET(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const where = status ? { status: status as 'new' | 'responded' | 'closed' } : {};
  const [enquiries, total] = await Promise.all([
    prisma.enquiry.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.enquiry.count({ where }),
  ]);
  return NextResponse.json({ success: true, data: enquiries, meta: { page, limit, total } });
}

export async function PUT(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: { code: 'MISSING_ID' } }, { status: 400 });
  const { status } = await req.json();
  const enquiry = await prisma.enquiry.update({ where: { id }, data: { status } });
  return NextResponse.json({ success: true, data: enquiry });
}
