import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
}

export function verifyToken(token: string): JwtPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function generateToken(payload: JwtPayload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
} 