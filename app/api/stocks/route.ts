import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../lib/apiAuth';
import { prisma } from '../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authResponse = await requireAuth(request);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const sector = searchParams.get('sector');

    const where: any = {};
    if (symbol) {
      where.symbol = { contains: symbol, mode: 'insensitive' };
    }
    if (sector) {
      where.sector = { contains: sector, mode: 'insensitive' };
    }

    const stocks = await prisma.stocks.findMany({
      where,
      orderBy: {
        symbol: 'asc'
      }
    });

    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
} 