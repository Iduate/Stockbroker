import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, resource } = body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const { id: paymentId, amount } = resource;
      
      // Update payment status
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'completed',
          amount: parseFloat(amount.value)
        }
      });

      // Update user's wallet balance
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { user: true }
      });

      if (payment) {
        await prisma.wallet.update({
          where: { userId: payment.userId },
          data: {
            balance: {
              increment: parseFloat(amount.value)
            }
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 