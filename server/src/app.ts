import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 