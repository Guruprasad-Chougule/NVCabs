// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

const schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
  name: z.string().min(2).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, name } = schema.parse(body);

    // Find latest valid OTP
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phone,
        otp,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_OTP', message: 'Invalid or expired OTP' } },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Upsert user
    const user = await prisma.user.upsert({
      where: { phone },
      update: { ...(name && { name }) },
      create: {
        phone,
        name: name || `Customer ${phone.slice(-4)}`,
        role: 'customer',
      },
    });

    const token = await signToken({ userId: user.id, role: user.role, phone: user.phone });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } },
        { status: 400 }
      );
    }
    console.error('[OTP Verify Error]', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Verification failed' } },
      { status: 500 }
    );
  }
}
