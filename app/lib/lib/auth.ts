import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  userId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function getUserFromToken(token: string) {
  try {
    const payload = await verifyToken(token);
    if (!payload?.sub) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      include: {
        wallet: true,
        accounts: true,
        portfolio: true,
      },
    });

    if (!user) return null;

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return getUserFromToken(token);
} 