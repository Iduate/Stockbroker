import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedUser } from '@/lib/apiAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const authResult = await requireVerifiedUser(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  return NextResponse.json({ user: authResult.user });
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireVerifiedUser(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    const { firstName, lastName } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: authResult.user.id },
      data: { firstName, lastName },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isVerified: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 