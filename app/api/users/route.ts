import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      country,
      phoneNumber,
      email,
      accountTypes,
      accountOwnership
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !country || !phoneNumber || !email || !accountTypes) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password (you might want to generate a random password or handle it differently)
    const hashedPassword = await bcrypt.hash(email, 10);

    // Create user with transaction to ensure all operations succeed or none do
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          firstName,
          middleName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          country,
          phoneNumber,
          email,
          password: hashedPassword,
        },
      });

      // Create accounts for the user
      const accountPromises = accountTypes.map(async (type: string) => {
        const accountNumber = `${type.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        return tx.account.create({
          data: {
            type,
            userId: user.id,
            accountNumber,
            status: 'pending',
            balance: 0,
          },
        });
      });

      const accounts = await Promise.all(accountPromises);

      return { user, accounts };
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        },
        accounts: result.accounts,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 