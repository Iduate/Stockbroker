import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Config {
  port: string | number;
  mongodbUri: string;
  jwtSecret: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string | undefined;
    pass: string | undefined;
    from: string | undefined;
  };
}

export const config: Config = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.DATABASE_URL || 'mongodb://localhost:27017/stockly-investor',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  }
}; 