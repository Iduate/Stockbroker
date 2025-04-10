import { NextResponse } from 'next/server';

export async function GET() {
  // For demo purposes, return a mock user
  return NextResponse.json({
    user: {
      email: 'demo@example.com',
      accounts: [
        { id: 'demo-account', type: 'trading' }
      ]
    }
  });
} 