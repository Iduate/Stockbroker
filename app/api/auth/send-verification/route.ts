import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { sendEmail } from '../../../../lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user with new verification code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        isVerified: false,
      },
    });

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
} 