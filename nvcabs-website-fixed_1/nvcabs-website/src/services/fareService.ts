// src/services/fareService.ts
import { FareEstimate, FareEstimateRequest, VehicleType, TripType } from '@/types';
import { calculateDistance, isNightTime } from '@/lib/utils';
import prisma from '@/lib/prisma';

// Fallback pricing if DB is unavailable
const FALLBACK_PRICING: Record<VehicleType, Record<TripType, { baseFare: number; perKmRate: number; driverBatta: number; nightSurcharge: number; gstPercent: number }>> = {
  sedan: {
    one_way: { baseFare: 300, perKmRate: 12, driverBatta: 0, nightSurcharge: 150, gstPercent: 5 },
    round_trip: { baseFare: 500, perKmRate: 11, driverBatta: 300, nightSurcharge: 150, gstPercent: 5 },
    multi_day: { baseFare: 1000, perKmRate: 11, driverBatta: 300, nightSurcharge: 150, gstPercent: 5 },
  },
  suv: {
    one_way: { baseFare: 500, perKmRate: 18, driverBatta: 0, nightSurcharge: 200, gstPercent: 5 },
    round_trip: { baseFare: 800, perKmRate: 17, driverBatta: 400, nightSurcharge: 200, gstPercent: 5 },
    multi_day: { baseFare: 1500, perKmRate: 17, driverBatta: 400, nightSurcharge: 200, gstPercent: 5 },
  },
  innova: {
    one_way: { baseFare: 400, perKmRate: 16, driverBatta: 0, nightSurcharge: 175, gstPercent: 5 },
    round_trip: { baseFare: 700, perKmRate: 15, driverBatta: 350, nightSurcharge: 175, gstPercent: 5 },
    multi_day: { baseFare: 1200, perKmRate: 15, driverBatta: 350, nightSurcharge: 175, gstPercent: 5 },
  },
  tempo_traveller: {
    one_way: { baseFare: 800, perKmRate: 25, driverBatta: 0, nightSurcharge: 300, gstPercent: 5 },
    round_trip: { baseFare: 1200, perKmRate: 23, driverBatta: 500, nightSurcharge: 300, gstPercent: 5 },
    multi_day: { baseFare: 2000, perKmRate: 23, driverBatta: 500, nightSurcharge: 300, gstPercent: 5 },
  },
  mini_bus: {
    one_way: { baseFare: 1500, perKmRate: 35, driverBatta: 0, nightSurcharge: 500, gstPercent: 5 },
    round_trip: { baseFare: 2000, perKmRate: 32, driverBatta: 800, nightSurcharge: 500, gstPercent: 5 },
    multi_day: { baseFare: 3000, perKmRate: 32, driverBatta: 800, nightSurcharge: 500, gstPercent: 5 },
  },
};

const TOLL_ESTIMATES: Record<string, number> = {
  'bangalore-ooty': 300,
  'bangalore-coorg': 250,
  'bangalore-mysore': 200,
  'bangalore-tirupati': 350,
  'bangalore-goa': 600,
  'default-short': 100,
  'default-medium': 200,
  'default-long': 400,
};

function estimateTolls(distanceKm: number): number {
  if (distanceKm < 100) return TOLL_ESTIMATES['default-short'];
  if (distanceKm < 300) return TOLL_ESTIMATES['default-medium'];
  return TOLL_ESTIMATES['default-long'];
}

export async function calculateFare(req: FareEstimateRequest): Promise<FareEstimate> {
  const { pickupLat, pickupLng, dropLat, dropLng, vehicleType, tripType, pickupDatetime } = req;

  // Calculate distance
  const distanceKm = calculateDistance(pickupLat, pickupLng, dropLat, dropLng);
  // Add 10% road winding factor
  const adjustedDistance = Math.round(distanceKm * 1.1);

  // Estimated duration (avg 50 km/h)
  const durationMinutes = Math.round((adjustedDistance / 50) * 60);

  // Get pricing
  let pricing = FALLBACK_PRICING[vehicleType]?.[tripType];
  try {
    const rule = await prisma.pricingRule.findUnique({
      where: { vehicleType_tripType: { vehicleType, tripType } },
    });
    if (rule) {
      pricing = {
        baseFare: Number(rule.baseFare),
        perKmRate: Number(rule.perKmRate),
        driverBatta: Number(rule.driverBatta),
        nightSurcharge: Number(rule.nightSurcharge),
        gstPercent: Number(rule.gstPercent),
      };
    }
  } catch {
    // Use fallback
  }

  const baseFare = pricing.baseFare;
  const distanceCharge = Math.round(adjustedDistance * pricing.perKmRate);
  const driverBatta = pricing.driverBatta;
  const tollEstimate = estimateTolls(adjustedDistance);
  const nightCharge = isNightTime(pickupDatetime) ? pricing.nightSurcharge : 0;

  const subtotal = baseFare + distanceCharge + driverBatta + tollEstimate + nightCharge;
  const gst = Math.round(subtotal * (pricing.gstPercent / 100));
  const total = subtotal + gst;

  return {
    distanceKm: adjustedDistance,
    durationMinutes,
    baseFare,
    distanceCharge,
    driverBatta,
    tollEstimate,
    nightCharge,
    subtotal,
    gst,
    total,
    vehicleType,
    tripType,
  };
}

export async function getAllVehicleFares(req: Omit<FareEstimateRequest, 'vehicleType'>): Promise<FareEstimate[]> {
  const vehicleTypes: VehicleType[] = ['sedan', 'suv', 'innova', 'tempo_traveller', 'mini_bus'];
  const fares = await Promise.all(
    vehicleTypes.map(vt => calculateFare({ ...req, vehicleType: vt }))
  );
  return fares;
}
