// src/app/api/admin/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

const schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.passwordHash || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid phone or password' } },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid phone or password' } },
        { status: 401 }
      );
    }

    const token = await signToken({ userId: user.id, role: user.role, phone: user.phone });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, role: user.role, phone: user.phone },
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Login failed' } },
      { status: 500 }
    );
  }
}
