import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';

const DEMO_ACCOUNTS: Record<string, { id: string; name: string; role: 'buyer' | 'seller' | 'agent' | 'admin'; phone: string; defaultRedirect: string }> = {
  'admin@example.com': {
    id: 'usr-admin-demo',
    name: 'Platform Admin',
    role: 'admin',
    phone: '+91 99000 11223',
    defaultRedirect: '/dashboard/admin',
  },
  'seller@example.com': {
    id: 'usr-seller-demo',
    name: 'Priya Sundaram (Seller)',
    role: 'seller',
    phone: '+91 98123 45678',
    defaultRedirect: '/dashboard/seller',
  },
  'buyer@example.com': {
    id: 'usr-buyer-demo',
    name: 'Rohan Sharma (Buyer)',
    role: 'buyer',
    phone: '+91 98765 43210',
    defaultRedirect: '/dashboard/buyer',
  },
  'agent@example.com': {
    id: 'usr-agent-demo',
    name: 'Rajesh Verma (Agent)',
    role: 'agent',
    phone: '+91 97111 22334',
    defaultRedirect: '/dashboard/seller',
  },
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // ULTRA FAST PATH: Instant (< 5ms) authentication for demo accounts
    if (DEMO_ACCOUNTS[cleanEmail] && password === 'password123') {
      const demo = DEMO_ACCOUNTS[cleanEmail];
      const token = signToken({
        userId: demo.id,
        email: cleanEmail,
        role: demo.role,
      });

      await setAuthCookie(token);

      return NextResponse.json({
        user: {
          id: demo.id,
          name: demo.name,
          email: cleanEmail,
          phone: demo.phone,
          role: demo.role,
          avatar: null,
        },
        redirectTo: demo.defaultRedirect,
        message: 'Logged in successfully',
      });
    }

    // Standard User Authentication with DB Timeout (max 2 seconds)
    let user: any = null;
    try {
      const dbPromise = prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timed out')), 2000)
      );
      user = await Promise.race([dbPromise, timeoutPromise]);
    } catch (dbErr) {
      console.warn('Prisma Database query bypassed or timed out:', dbErr);
    }

    // Fallback if DB was unavailable and it matched demo account with correct password
    if (!user && DEMO_ACCOUNTS[cleanEmail] && password === 'password123') {
      const demo = DEMO_ACCOUNTS[cleanEmail];
      user = {
        id: demo.id,
        name: demo.name,
        email: cleanEmail,
        phone: demo.phone,
        passwordHash: '',
        role: demo.role,
        verifiedStatus: 'verified',
        avatar: null,
      };
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isDemoAccount = Boolean(DEMO_ACCOUNTS[cleanEmail]);
    const isValid = isDemoAccount && password === 'password123'
      ? true
      : user.passwordHash
      ? await verifyPassword(password, user.passwordHash)
      : false;

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    const redirectPath =
      user.role === 'admin'
        ? '/dashboard/admin'
        : user.role === 'seller' || user.role === 'agent'
        ? '/dashboard/seller'
        : '/dashboard/buyer';

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      redirectTo: redirectPath,
      message: 'Logged in successfully',
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Login process encountered an issue' }, { status: 500 });
  }
}
