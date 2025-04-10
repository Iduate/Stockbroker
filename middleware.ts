import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token && !publicPaths.includes(pathname)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token for protected routes
  if (token) {
    const payload = await verifyToken(token);
    if (!payload) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/auth/login',
    '/auth/register',
  ],
}; 