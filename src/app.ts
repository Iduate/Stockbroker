import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Start the connection process
connectWithRetry(); 