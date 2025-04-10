import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stockly-investor',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  }
}; 