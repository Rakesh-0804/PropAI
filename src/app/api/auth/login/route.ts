import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';

const DEMO_ACCOUNTS: Record<string, any> = {
  'buyer@example.com': { id: 'usr-buyer-demo', name: 'Rohan Sharma (Buyer)', role: 'buyer', phone: '+91 98765 43210' },
  'seller@example.com': { id: 'usr-seller-demo', name: 'Priya Sundaram (Seller)', role: 'seller', phone: '+91 98123 45678' },
  'agent@example.com': { id: 'usr-agent-demo', name: 'Rajesh Verma (Agent)', role: 'agent', phone: '+91 97111 22334' },
  'admin@example.com': { id: 'usr-admin-demo', name: 'Platform Admin', role: 'admin', phone: '+91 99000 11223' },
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user: any = null;

    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      console.warn('Prisma Database connection unavailable. Attempting demo fallback...');
    }

    // Demo account fallback validation if DB is offline or account not found
    if (!user && DEMO_ACCOUNTS[cleanEmail]) {
      if (password === 'password123') {
        user = {
          id: DEMO_ACCOUNTS[cleanEmail].id,
          name: DEMO_ACCOUNTS[cleanEmail].name,
          email: cleanEmail,
          phone: DEMO_ACCOUNTS[cleanEmail].phone,
          passwordHash: '',
          role: DEMO_ACCOUNTS[cleanEmail].role,
          verifiedStatus: 'verified',
          avatar: null,
        };
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isDemoAccount = Boolean(DEMO_ACCOUNTS[cleanEmail]);
    const isValid = (isDemoAccount && password === 'password123')
      ? true
      : (user.passwordHash ? await verifyPassword(password, user.passwordHash) : false);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      message: 'Logged in successfully',
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Login process encountered an issue' }, { status: 500 });
  }
}
