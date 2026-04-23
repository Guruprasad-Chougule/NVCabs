// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { generateBookingRef } from '@/lib/utils';
import { sendBookingConfirmation } from '@/services/notificationService';
import { rateLimit } from '@/lib/auth';

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  email: z.string().email().optional().or(z.literal('')),
  pickupLocation: z.string().min(5, 'Pickup location required'),
  pickupLat: z.number().default(12.9716),
  pickupLng: z.number().default(77.5946),
  dropLocation: z.string().min(5, 'Drop location required'),
  dropLat: z.number().default(11.4102),
  dropLng: z.number().default(76.6950),
  tripType: z.enum(['one_way', 'round_trip', 'multi_day']),
  pickupDate: z.string(),
  pickupTime: z.string(),
  returnDate: z.string().optional(),
  vehicleType: z.enum(['sedan', 'suv', 'innova', 'tempo_traveller', 'mini_bus']),
  passengers: z.number().int().min(1).max(40),
  specialInstructions: z.string().max(500).optional(),
  estimatedFare: z.number().optional(),
  estimatedDistanceKm: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`booking:${ip}`, 5, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests. Please try again.' } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = bookingSchema.parse(body);

    const pickupDatetime = new Date(`${data.pickupDate}T${data.pickupTime}`);
    const returnDatetime = data.returnDate ? new Date(`${data.returnDate}T${data.pickupTime}`) : null;

    if (isNaN(pickupDatetime.getTime())) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid pickup date/time' } },
        { status: 400 }
      );
    }

    if (pickupDatetime < new Date()) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Pickup time must be in the future' } },
        { status: 400 }
      );
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { phone: data.phone },
      update: { name: data.fullName, ...(data.email && { email: data.email }) },
      create: {
        name: data.fullName,
        phone: data.phone,
        email: data.email || null,
        role: 'customer',
      },
    });

    // Find matching vehicle
    const vehicle = await prisma.vehicle.findFirst({
      where: { type: data.vehicleType, isActive: true },
    });

    const bookingRef = generateBookingRef();

    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        userId: user.id,
        vehicleId: vehicle?.id || null,
        tripType: data.tripType,
        pickupLocation: data.pickupLocation,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        dropLocation: data.dropLocation,
        dropLat: data.dropLat,
        dropLng: data.dropLng,
        pickupDatetime,
        returnDatetime,
        passengers: data.passengers,
        estimatedDistanceKm: data.estimatedDistanceKm || null,
        estimatedFare: data.estimatedFare || null,
        specialInstructions: data.specialInstructions || null,
        status: 'pending',
        paymentStatus: 'unpaid',
      },
    });

    // Send notifications (non-blocking)
    sendBookingConfirmation(data.phone, data.email || null, {
      bookingRef,
      pickupLocation: data.pickupLocation,
      pickupDatetime: pickupDatetime.toISOString(),
    }).catch(err => console.error('[Notification Error]', err));

    return NextResponse.json({
      success: true,
      data: {
        bookingRef: booking.bookingRef,
        bookingId: booking.id,
        status: booking.status,
        pickupDatetime: booking.pickupDatetime,
        estimatedFare: booking.estimatedFare,
        message: 'Your booking has been confirmed! You will receive an SMS shortly.',
      },
    }, { status: 201 });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: err.errors[0].message, details: err.errors } },
        { status: 400 }
      );
    }
    console.error('[Booking Create Error]', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create booking' } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');

  if (!ref) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_PARAM', message: 'Booking reference required' } },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { bookingRef: ref },
    include: {
      user: { select: { name: true, phone: true, email: true } },
      driver: { include: { user: { select: { name: true, phone: true } } } },
      vehicle: true,
    },
  });

  if (!booking) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Booking not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: booking });
}
