// src/app/api/fare-estimate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateFare, getAllVehicleFares } from '@/services/fareService';

const schema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropLat: z.number(),
  dropLng: z.number(),
  vehicleType: z.enum(['sedan', 'suv', 'innova', 'tempo_traveller', 'mini_bus']).optional(),
  tripType: z.enum(['one_way', 'round_trip', 'multi_day']),
  pickupDatetime: z.string(),
  allVehicles: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (data.allVehicles) {
      const fares = await getAllVehicleFares({
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        dropLat: data.dropLat,
        dropLng: data.dropLng,
        tripType: data.tripType,
        pickupDatetime: data.pickupDatetime,
      });
      return NextResponse.json({ success: true, data: fares });
    }

    if (!data.vehicleType) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'vehicleType is required when allVehicles is false' } },
        { status: 400 }
      );
    }

    const fare = await calculateFare({
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      dropLat: data.dropLat,
      dropLng: data.dropLng,
      vehicleType: data.vehicleType,
      tripType: data.tripType,
      pickupDatetime: data.pickupDatetime,
    });

    return NextResponse.json({ success: true, data: fare });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } },
        { status: 400 }
      );
    }
    console.error('[Fare Estimate Error]', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to calculate fare' } },
      { status: 500 }
    );
  }
}
