import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/apiAuth';

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth(request as any);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { stockSymbol, quantity, paymentMethod, totalAmount } = await request.json();

    if (!stockSymbol || !quantity || !paymentMethod || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: authResult.user.id,
        stockSymbol,
        quantity,
        price: totalAmount / quantity,
        totalAmount,
        type: 'BUY',
        status: 'PENDING',
        paymentMethod,
      },
    });

    return NextResponse.json({
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 