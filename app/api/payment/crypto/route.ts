import { NextResponse } from 'next/server';

// Mock exchange rates (in a real app, fetch from a crypto price API)
const EXCHANGE_RATES = {
  BTC: 40000,
  ETH: 2200,
  USDT: 1,
};

// Mock wallet addresses (in a real app, generate unique addresses for each transaction)
const WALLET_ADDRESSES = {
  BTC: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
  ETH: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  USDT: 'TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, userId, currency = 'BTC' } = body;

    if (!EXCHANGE_RATES[currency]) {
      return NextResponse.json(
        { error: 'Unsupported cryptocurrency' },
        { status: 400 }
      );
    }

    // Calculate crypto amount based on current exchange rate
    const cryptoAmount = amount / EXCHANGE_RATES[currency];

    // In a real application, you would:
    // 1. Generate a unique wallet address for this transaction
    // 2. Save the pending transaction in your database
    // 3. Set up webhooks to monitor the blockchain for payment
    // 4. Send confirmation email to user
    // 5. Update user's balance once payment is confirmed

    return NextResponse.json({
      success: true,
      message: 'Crypto payment address generated',
      currency,
      fiatAmount: amount,
      cryptoAmount: cryptoAmount.toFixed(8),
      address: WALLET_ADDRESSES[currency],
      exchangeRate: EXCHANGE_RATES[currency],
      expiresIn: '1 hour',
    });
  } catch (error) {
    console.error('Crypto payment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate crypto payment' },
      { status: 500 }
    );
  }
} 