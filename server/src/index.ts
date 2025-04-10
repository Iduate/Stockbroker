import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config';
import { register, login } from './controllers/authController';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongodbUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
}); 