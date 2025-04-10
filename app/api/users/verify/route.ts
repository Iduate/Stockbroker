import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    // Find user with matching email and verification code
    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationCode: code,
        isVerified: false,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null, // Clear the verification code
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
} 