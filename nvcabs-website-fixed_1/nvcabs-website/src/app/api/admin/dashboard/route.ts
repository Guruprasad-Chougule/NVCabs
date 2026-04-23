// src/app/api/admin/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayBookings,
      totalBookings,
      activeTrips,
      pendingEnquiries,
      totalDrivers,
      totalVehicles,
      revenueToday,
      revenueTotal,
      bookingsByStatus,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'in_progress' } }),
      prisma.enquiry.count({ where: { status: 'new' } }),
      prisma.driver.count({ where: { isAvailable: true } }),
      prisma.vehicle.count({ where: { isActive: true } }),
      prisma.booking.aggregate({
        where: { createdAt: { gte: today, lt: tomorrow }, paymentStatus: 'paid' },
        _sum: { finalFare: true },
      }),
      prisma.booking.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { finalFare: true },
      }),
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, phone: true } },
          vehicle: { select: { type: true, model: true } },
        },
      }),
    ]);

    const statusMap: Record<string, number> = {};
    bookingsByStatus.forEach(b => { statusMap[b.status] = b._count.status; });

    return NextResponse.json({
      success: true,
      data: {
        todayBookings,
        todayRevenue: Number(revenueToday._sum.finalFare) || 0,
        activeTrips,
        pendingEnquiries,
        totalBookings,
        totalRevenue: Number(revenueTotal._sum.finalFare) || 0,
        totalDrivers,
        totalVehicles,
        bookingsByStatus: statusMap,
        recentBookings,
      },
    });
  } catch (err) {
    console.error('[Admin Dashboard Error]', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to load dashboard' } },
      { status: 500 }
    );
  }
}
