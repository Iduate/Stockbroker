import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (user instanceof NextResponse) return user;

    const { amount, currency = 'USD' } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount,
        currency,
        status: 'pending',
        paymentMethod: 'paypal'
      }
    });

    return NextResponse.json({
      paymentId: payment.id,
      amount,
      currency
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
} 