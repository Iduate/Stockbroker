import { NextResponse } from 'next/server';

export async function GET() {
  // For demo purposes, return mock portfolio data
  return NextResponse.json({
    portfolio: [
      {
        symbol: 'AAPL',
        quantity: 10,
        avgPrice: 175.50,
        currentPrice: 180.25,
        totalValue: 1802.50,
        dayChange: 47.50,
        dayChangePercent: 2.71
      },
      {
        symbol: 'GOOGL',
        quantity: 5,
        avgPrice: 2800.00,
        currentPrice: 2850.75,
        totalValue: 14253.75,
        dayChange: 253.75,
        dayChangePercent: 1.81
      },
      {
        symbol: 'MSFT',
        quantity: 15,
        avgPrice: 320.25,
        currentPrice: 328.50,
        totalValue: 4927.50,
        dayChange: 123.75,
        dayChangePercent: 2.57
      }
    ]
  });
} 