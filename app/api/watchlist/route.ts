import { NextResponse } from 'next/server';

export async function GET() {
  // For demo purposes, return mock watchlist data
  return NextResponse.json({
    watchlist: [
      {
        symbol: 'TSLA',
        price: 242.50,
        change: 5.75,
        percentChange: 2.43
      },
      {
        symbol: 'NVDA',
        price: 875.25,
        change: 15.50,
        percentChange: 1.80
      },
      {
        symbol: 'AMD',
        price: 180.75,
        change: -2.25,
        percentChange: -1.23
      }
    ]
  });
} 