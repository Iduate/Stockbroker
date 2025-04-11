import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Quick validation
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Quick check for existing user
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email },
      select: { id: true }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create all records in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: new Date(),
          country: 'US',
          phoneNumber: '+10000000000',
          accountOwnership: 'individual',
          isVerified: true
        }
      });

      // Create all related records in parallel
      const [wallet, account, portfolio] = await Promise.all([
        tx.wallet.create({
          data: {
            userId: user.id,
            balance: 0,
            currency: 'USD'
          }
        }),
        tx.account.create({
          data: {
            userId: user.id,
            name: 'Main Account',
            type: 'individual',
            status: 'active',
            balance: 0,
            currency: 'USD',
            accountNumber: `ACC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
          }
        }),
        tx.portfolio.create({
          data: {
            userId: user.id,
            holdings: {}
          }
        })
      ]);

      return { user, wallet, account, portfolio };
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.user.id,
        email: result.user.email
      },
      process.env.JWT_SECRET || '',
      { expiresIn: '7d' }
    );

    // Return response with all created records
    return NextResponse.json({ 
      success: true,
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        wallet: result.wallet,
        accounts: [result.account],
        portfolio: result.portfolio
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
} 