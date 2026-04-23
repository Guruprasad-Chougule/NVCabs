// src/app/api/admin/reports/revenue/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to   = searchParams.get('to')   ? new Date(searchParams.get('to')!)   : new Date();

  try {
    const [totalRevenue, paidBookings, completedBookings, topRoutes] = await Promise.all([
      prisma.booking.aggregate({
        where: { createdAt: { gte: from, lte: to }, paymentStatus: 'paid' },
        _sum: { finalFare: true },
        _count: true,
      }),
      prisma.booking.count({ where: { createdAt: { gte: from, lte: to }, paymentStatus: 'paid' } }),
      prisma.booking.count({ where: { createdAt: { gte: from, lte: to }, status: 'completed' } }),
      prisma.booking.groupBy({
        by: ['dropLocation'],
        where: { createdAt: { gte: from, lte: to } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        period: { from, to },
        totalRevenue: Number(totalRevenue._sum.finalFare) || 0,
        totalBookings: totalRevenue._count,
        paidBookings,
        completedBookings,
        topRoutes: topRoutes.map(r => ({ route: r.dropLocation, count: r._count.id })),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to generate report' } },
      { status: 500 }
    );
  }
}
