import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const sampleStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 175.34,
    sector: 'Technology',
    marketCap: 2700000000000,
    peRatio: 28.5,
    dividendYield: 0.5,
    volume: 50000000,
    change: 2.34,
    changePercent: 1.35,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 330.45,
    sector: 'Technology',
    marketCap: 2500000000000,
    peRatio: 32.1,
    dividendYield: 0.8,
    volume: 35000000,
    change: 1.89,
    changePercent: 0.57,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 145.67,
    sector: 'Technology',
    marketCap: 1800000000000,
    peRatio: 24.8,
    dividendYield: 0.0,
    volume: 20000000,
    change: -0.45,
    changePercent: -0.31,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    currentPrice: 175.25,
    sector: 'Consumer Cyclical',
    marketCap: 1800000000000,
    peRatio: 60.3,
    dividendYield: 0.0,
    volume: 40000000,
    change: 3.21,
    changePercent: 1.87,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    currentPrice: 180.45,
    sector: 'Financial Services',
    marketCap: 520000000000,
    peRatio: 11.2,
    dividendYield: 2.4,
    volume: 15000000,
    change: -1.23,
    changePercent: -0.68,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function POST() {
  try {
    console.log('Starting database seed...');
    
    const client = await MongoClient.connect(process.env.DATABASE_URL || '');
    const db = client.db();
    
    // Delete existing stocks
    console.log('Deleting existing stocks...');
    await db.collection('Stock').deleteMany({});
    console.log('Existing stocks deleted');

    // Create new stocks
    console.log('Creating new stocks...');
    const result = await db.collection('Stock').insertMany(sampleStocks);
    console.log('New stocks created:', result);

    await client.close();

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      count: result.insertedCount
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 