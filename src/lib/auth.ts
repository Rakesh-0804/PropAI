import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-real-estate-key-2026';
const TOKEN_NAME = 'prop_auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    if (!hash) return false;
    return bcrypt.compare(password, hash);
  } catch (err) {
    return false;
  }
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getCurrentUser() {
  let token: string | undefined;
  try {
    const cookieStore = cookies();
    token = cookieStore.get(TOKEN_NAME)?.value;
  } catch (err) {
    return null;
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        verifiedStatus: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (user) {
      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
      };
    }
  } catch (error) {
    console.warn('DB unreachable in getCurrentUser, using JWT fallback payload');
  }

  // Graceful Fallback if DB is offline or user not found
  return {
    id: payload.userId,
    name: payload.email ? payload.email.split('@')[0].toUpperCase() : 'User',
    email: payload.email,
    role: payload.role as any,
    verifiedStatus: 'verified',
    createdAt: new Date().toISOString(),
  };
}
