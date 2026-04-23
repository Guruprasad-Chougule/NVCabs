// src/app/api/tour-packages/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const pkg = await prisma.tourPackage.findUnique({ where: { slug: params.slug } });
    if (!pkg) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Package not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: pkg });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch package' } },
      { status: 500 }
    );
  }
}
