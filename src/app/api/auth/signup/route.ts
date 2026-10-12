import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const validRole = ['buyer', 'seller', 'agent'].includes(role) ? role : 'buyer';

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        passwordHash,
        role: validRole,
        verifiedStatus: 'verified',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        avatar: newUser.avatar,
      },
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
