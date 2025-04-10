import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        wallet: true,
        accounts: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return user;
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

export async function requireAuth(request: NextRequest) {
  const result = await authenticateRequest(request);
  if (result instanceof NextResponse) return result;
  return result;
}

export async function requireVerifiedUser(request: NextRequest) {
  const result = await authenticateRequest(request);
  if (result instanceof NextResponse) return result;
  
  if (!result.isEmailVerified) {
    return NextResponse.json(
      { error: 'Email verification required' },
      { status: 403 }
    );
  }
  
  return result;
} 