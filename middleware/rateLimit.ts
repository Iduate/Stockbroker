import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import { NextResponse } from 'next/server';

// Create Redis store for rate limiting
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// Create rate limiter
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redis,
    prefix: 'rate-limit:',
  }),
  handler: (req, res) => {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    );
  },
}); 