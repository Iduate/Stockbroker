import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  try {
    // Get the cookie from the request headers
    const cookieHeader = request.headers.get('cookie');
    const cookies = new Map(
      cookieHeader?.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=');
        return [key, value];
      }) || []
    );
    
    const token = cookies.get('auth_token');

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { user: any };
    
    if (!decoded || !decoded.user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: decoded.user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
} 