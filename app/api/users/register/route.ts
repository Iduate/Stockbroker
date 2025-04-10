import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Function to generate a random 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure email transporter
const transporter = createTransport({
  // Configure your email service here
  // Example for Gmail:
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        country: data.country,
        phoneNumber: data.phoneNumber,
        accountTypes: data.accountTypes,
        accountOwnership: data.accountOwnership,
        verificationCode,
        isVerified: false,
      },
    });

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: 'Verify your StockryInvestor account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Welcome to StockryInvestor!</h1>
          <p>Thank you for creating an account. To complete your registration, please use the following verification code:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="color: #2563eb; font-size: 32px; letter-spacing: 4px; margin: 0;">${verificationCode}</h2>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
} 