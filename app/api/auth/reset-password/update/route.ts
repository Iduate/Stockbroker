import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required' },
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

    // Verify code again
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset code
    await users.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          resetPasswordCode: null,
          resetPasswordExpires: null,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 