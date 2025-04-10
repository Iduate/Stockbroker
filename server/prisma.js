import { PrismaClient } from '@prisma/client';

// Initialize Prisma with logging configuration
const prisma = new PrismaClient({
  log: ['error']  // Only log errors in production
});

export { prisma }; 