import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (user instanceof NextResponse) return user;

    return NextResponse.json({
      clientId: process.env.PAYPAL_CLIENT_ID,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Payment setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup payment' },
      { status: 500 }
    );
  }
} 