// src/app/api/routes/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const route = await prisma.route.findUnique({ where: { slug: params.slug } });
    if (!route) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: route });
  } catch (err) {
    console.error('[Route Slug Error]', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch route' } },
      { status: 500 }
    );
  }
}
