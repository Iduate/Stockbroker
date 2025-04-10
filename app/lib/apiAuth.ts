import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { prisma } from './prisma';

interface JwtPayload {
  userId: string;
  email: string;
}

interface UserWithRelations {
  id: string;
  email: string;
  isVerified: boolean;
  wallet: {
    id: string;
    balance: number;
    currency: string;
  } | null;
  accounts: Array<{
    id: string;
    type: string;
    name: string;
    status: string;
  }>;
}

export async function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return { error: 'Authentication required' };
  }

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        wallet: true,
        accounts: true
      }
    });

    if (!user) {
      return { error: 'User not found' };
    }

    return { user };
  } catch (error) {
    return { error: 'Invalid token' };
  }
}

export async function requireAuth(request: NextRequest) {
  const result = await authenticateRequest(request);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return result.user;
}

export async function requireVerifiedUser(request: NextRequest) {
  const result = await authenticateRequest(request);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  if (!result.user.isVerified) {
    return NextResponse.json({ error: 'Email not verified' }, { status: 403 });
  }
  return result.user;
} 