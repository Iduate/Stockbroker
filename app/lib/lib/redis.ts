import Redis from 'ioredis';

// Create Redis connection pool
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000,
});

// Cache keys
export const CACHE_KEYS = {
  USER_EXISTS: (email: string) => `user:exists:${email}`,
  USER_DATA: (userId: string) => `user:data:${userId}`,
};

// Cache TTLs in seconds
export const CACHE_TTL = {
  USER_EXISTS: 300, // 5 minutes
  USER_DATA: 600, // 10 minutes
};

export default redis; 