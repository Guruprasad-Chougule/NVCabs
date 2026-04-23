// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';


const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'
);

export async function signToken(payload: { userId: string; role: string; phone: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string; role: string; phone: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string; phone: string };
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<{ userId: string; role: string; phone: string } | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  return verifyToken(token);
}

export function requireAuth(roles: string[] = []) {
  return async (req: NextRequest, handler: (req: NextRequest, user: { userId: string; role: string; phone: string }) => Promise<NextResponse>) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 });
    }
    if (roles.length > 0 && !roles.includes(user.role)) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } }, { status: 403 });
    }
    return handler(req, user);
  };
}

// Rate limiting (simple in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) return false;

  record.count++;
  return true;
}
