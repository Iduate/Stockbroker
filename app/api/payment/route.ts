import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const authResponse = await requireAuth(request);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const user = authResponse;
    const body = await request.json();
    const { amount, currency = 'USD' } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        amount,
        currency,
        status: 'pending',
        type: 'paypal',
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