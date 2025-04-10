import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Try to connect to the database
    await prisma.$connect();
    
    // Try to count users
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 