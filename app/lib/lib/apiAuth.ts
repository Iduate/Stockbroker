import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { prisma } from './prisma';

export async function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return { error: 'No token provided' };
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
    return { error: result.error };
  }
  return { user: result.user };
}

export async function requireVerifiedUser(request: NextRequest) {
  const result = await authenticateRequest(request);
  if ('error' in result) {
    return { error: result.error };
  }
  if (!result.user.emailVerified) {
    return { error: 'Email not verified' };
  }
  return { user: result.user };
} 