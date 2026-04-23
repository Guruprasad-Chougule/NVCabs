// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { generateOTP } from '@/lib/utils';
import { sendOTPNotification } from '@/services/notificationService';
import { rateLimit } from '@/lib/auth';

const schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = schema.parse(body);

    // Rate limit: 3 OTPs per 15 minutes per phone
    if (!rateLimit(`otp:${phone}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMIT', message: 'Too many OTP requests. Please wait 15 minutes.' } },
        { status: 429 }
      );
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '10') * 60 * 1000);

    // Invalidate existing OTPs for this phone
    await prisma.otpVerification.updateMany({
      where: { phone, verified: false },
      data: { verified: true },
    });

    // Create new OTP record
    await prisma.otpVerification.create({
      data: { phone, otp, expiresAt },
    });

    // Send OTP via SMS
    await sendOTPNotification(phone, otp);

    return NextResponse.json({
      success: true,
      data: {
        message: `OTP sent to ${phone.slice(0, 5)}*****`,
        expiresIn: parseInt(process.env.OTP_EXPIRY_MINUTES || '10') * 60,
        // In development, include OTP for testing
        ...(process.env.MOCK_OTP_ENABLED === 'true' && { mockOtp: otp }),
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } },
        { status: 400 }
      );
    }
    console.error('[OTP Send Error]', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to send OTP' } },
      { status: 500 }
    );
  }
}
