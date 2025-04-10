import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface CustomJWTPayload extends JwtPayload {
  userId: string;
}

export function generateToken(payload: { userId: string }, expiresIn: string = '1h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): CustomJWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
} 