import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/apiAuth';

// Mock exchange rates (in a real app, fetch from a crypto price API)
const EXCHANGE_RATES = {
  BTC: 50000,
  ETH: 3000,
  USDT: 1
} as const;

type CryptoCurrency = keyof typeof EXCHANGE_RATES;

// Mock wallet addresses (in a real app, generate unique addresses for each transaction)
const WALLET_ADDRESSES = {
  BTC: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
  ETH: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  USDT: 'TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6',
};

export async function POST(request: NextRequest) {
  try {
    const authResponse = await requireAuth(request);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const user = authResponse;
    const body = await request.json();
    const { amount, currency = 'BTC' } = body;

    // Validate currency
    const cryptoCurrency = currency as CryptoCurrency;
    if (!EXCHANGE_RATES[cryptoCurrency]) {
      return NextResponse.json(
        { error: 'Unsupported cryptocurrency' },
        { status: 400 }
      );
    }

    // Calculate USD amount
    const usdAmount = amount * EXCHANGE_RATES[cryptoCurrency];

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        amount: usdAmount,
        currency: 'USD',
        status: 'pending',
        type: 'crypto',
        paymentMethod: 'crypto',
        cryptoDetails: {
          cryptoCurrency,
          cryptoAmount: amount
        }
      }
    });

    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Crypto payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 