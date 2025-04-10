import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { prisma } from '@/lib/prisma';

const VALID_ACCOUNT_TYPES = [
  'retirement',
  'health',
  'inheritance',
  'brokerage',
  'college'
];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { accountType } = await request.json();

    // Validate account type
    if (!VALID_ACCOUNT_TYPES.includes(accountType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account type' },
        { status: 400 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has this type of account
    const existingAccount = user.accounts.find(acc => acc.type === accountType);
    if (existingAccount) {
      return NextResponse.json(
        { success: false, error: `You already have a ${accountType} account` },
        { status: 400 }
      );
    }

    // Generate a unique account number (you might want to implement a more sophisticated method)
    const accountNumber = `${accountType.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Store the account type in the database with user reference
    const account = await prisma.account.create({
      data: {
        type: accountType,
        userId: user.id,
        accountNumber,
        status: 'pending',
        balance: 0
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        ...account,
        accountNumber: accountNumber // Include the generated account number in the response
      }
    });
  } catch (error) {
    console.error('Error storing account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to store account type' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accounts = await prisma.account.findMany({
      where: {
        userId: session.user.id,
        status: 'active'
      }
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
} 