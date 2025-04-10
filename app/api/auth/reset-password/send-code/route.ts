import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { generateVerificationCode } from '../../../../../lib/utils';
import { sendEmail } from '../../../../../lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Update user with verification code
    await users.updateOne(
      { email },
      {
        $set: {
          resetPasswordCode: verificationCode,
          resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
      }
    );

    // Send email with verification code
    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      text: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
    });

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 