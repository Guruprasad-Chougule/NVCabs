// src/app/api/tour-packages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = category;

    const [packages, total] = await Promise.all([
      prisma.tourPackage.findMany({ where, skip, take: limit, orderBy: { basePrice: 'asc' } }),
      prisma.tourPackage.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: packages,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[Tour Packages Error]', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch packages' } },
      { status: 500 }
    );
  }
}
