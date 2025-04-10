import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Find user by email and verification code
    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationCode: code,
        isVerified: false
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification code or email' },
        { status: 400 }
      );
    }

    // Update user verification status
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationCode: null
        }
      }),
      // Update all accounts to active status
      prisma.account.updateMany({
        where: { userId: user.id },
        data: { status: 'active' }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify email' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.json({ valid: true, user: decoded });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 