// src/app/api/enquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`enquiry:${ip}`, 3, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMIT', message: 'Too many submissions. Please wait.' } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = schema.parse(body);

    const enquiry = await prisma.enquiry.create({ data });

    return NextResponse.json({
      success: true,
      data: { id: enquiry.id, message: 'Thank you! We will get back to you within 24 hours.' },
    }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Submission failed' } },
      { status: 500 }
    );
  }
}
