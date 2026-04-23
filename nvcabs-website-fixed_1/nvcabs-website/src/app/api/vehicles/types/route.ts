// src/app/api/vehicles/types/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const rules = await prisma.pricingRule.findMany({
      where: { tripType: 'one_way' },
    });

    const vehicles = await prisma.vehicle.findMany({
      where: { isActive: true },
      distinct: ['type'],
    });

    const data = vehicles.map(v => {
      const rule = rules.find(r => r.vehicleType === v.type);
      return {
        type: v.type,
        make: v.make,
        model: v.model,
        capacity: v.capacity,
        ac: v.ac,
        imageUrl: v.imageUrl,
        ratePerKm: rule ? Number(rule.perKmRate) : Number(v.ratePerKm),
        baseFare: rule ? Number(rule.baseFare) : 300,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[Vehicles Error]', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch vehicles' } },
      { status: 500 }
    );
  }
}
