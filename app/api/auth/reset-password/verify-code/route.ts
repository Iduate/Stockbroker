import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if code exists and hasn't expired
    if (!user.resetPasswordCode || !user.resetPasswordExpires) {
      return NextResponse.json(
        { error: 'No reset password request found' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.resetPasswordExpires)) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      );
    }

    if (user.resetPasswordCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Code verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 