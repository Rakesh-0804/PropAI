import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, Next.js internal routes, auth API routes, login and signup pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    return NextResponse.next();
  }

  // Check for authentication token cookie
  const token = request.cookies.get('prop_auth_token')?.value;

  // If no auth token present, force redirect to /login page first
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Decode role payload from JWT token
  const role = decodeRoleFromToken(token);

  // Role-Based Access Control (RBAC) Protections
  if (pathname.startsWith('/dashboard/admin')) {
    if (role !== 'admin') {
      const targetDashboard = (role === 'seller' || role === 'agent') ? '/dashboard/seller' : '/dashboard/buyer';
      const redirectUrl = new URL(targetDashboard, request.url);
      redirectUrl.searchParams.set('unauthorized', 'admin_only');
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname.startsWith('/dashboard/seller')) {
    if (role !== 'admin' && role !== 'seller' && role !== 'agent') {
      const redirectUrl = new URL('/dashboard/buyer', request.url);
      redirectUrl.searchParams.set('unauthorized', 'seller_only');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

function decodeRoleFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.role || null;
  } catch {
    return null;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
