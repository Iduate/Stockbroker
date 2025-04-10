import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all stocks
router.get('/', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement stock fetching logic
    const stocks = []; // Replace with actual stock data
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ message: 'Error fetching stocks' });
  }
});

// Get stock by symbol
router.get('/:symbol', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    // TODO: Implement single stock fetching logic
    const stock = {}; // Replace with actual stock data
    res.json(stock);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ message: 'Error fetching stock' });
  }
});

export default router; 