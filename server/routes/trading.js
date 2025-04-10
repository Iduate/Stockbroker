import express from 'express';
import axios from 'axios';
import { prisma } from '../prisma.js';

const router = express.Router();

// API Configuration
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Helper function to get real-time stock quote using Finnhub
async function getStockQuote(symbol) {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol,
        token: FINNHUB_API_KEY
      }
    });

    const data = response.data;
    if (!data) {
      throw new Error('No quote data available');
    }

    return {
      symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      volume: data.t,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}

// Search for stocks using Finnhub
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${FINNHUB_BASE_URL}/search`, {
      params: {
        q: query,
        token: FINNHUB_API_KEY
      }
    });

    const results = response.data.result.map(stock => ({
      symbol: stock.symbol,
      name: stock.description,
      type: stock.type,
      currency: stock.currency
    }));

    res.json(results);
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ error: 'Failed to search stocks' });
  }
});

// Get stock quote
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await getStockQuote(symbol);
    res.json(quote);
  } catch (error) {
    console.error('Quote fetch error:', error);
    res.status(500).json({ message: 'Error fetching stock quote' });
  }
});

// Place a trade
router.post('/trade', async (req, res) => {
  try {
    const { userId, symbol, type, shares } = req.body;

    // Get current stock price
    const quote = await getStockQuote(symbol);
    const price = quote.price;
    const total = price * shares;

    // Start transaction
    const trade = await prisma.$transaction(async (tx) => {
      // Get or create portfolio
      let portfolio = await tx.portfolio.findFirst({
        where: { userId }
      });

      if (!portfolio) {
        portfolio = await tx.portfolio.create({
          data: { userId }
        });
      }

      // Get or create holding
      let holding = await tx.holding.findFirst({
        where: {
          portfolioId: portfolio.id,
          symbol
        }
      });

      // Calculate new position
      let newShares = shares;
      if (holding) {
        if (type === 'BUY') {
          newShares = holding.shares + shares;
        } else {
          if (holding.shares < shares) {
            throw new Error('Insufficient shares');
          }
          newShares = holding.shares - shares;
        }
      } else if (type === 'SELL') {
        throw new Error('No existing position to sell');
      }

      // Update or create holding
      const holdingData = {
        symbol,
        shares: newShares,
        avgPrice: type === 'BUY' ? 
          (holding ? 
            ((holding.avgPrice * holding.shares) + (price * shares)) / (holding.shares + shares) 
            : price) 
          : holding.avgPrice,
        lastPrice: price
      };

      if (holding) {
        holding = await tx.holding.update({
          where: { id: holding.id },
          data: holdingData
        });
      } else {
        holding = await tx.holding.create({
          data: {
            ...holdingData,
            portfolioId: portfolio.id
          }
        });
      }

      // Create trade record
      const trade = await tx.trade.create({
        data: {
          userId,
          holdingId: holding.id,
          type,
          symbol,
          shares,
          price,
          total,
          status: 'COMPLETED'
        }
      });

      return trade;
    });

    res.json({
      message: 'Trade executed successfully',
      trade
    });
  } catch (error) {
    console.error('Trade execution error:', error);
    res.status(500).json({ message: error.message || 'Error executing trade' });
  }
});

// Get portfolio
router.get('/portfolio/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId },
      include: {
        holdings: true
      }
    });

    if (!portfolio) {
      return res.json({ holdings: [] });
    }

    // Get current prices for all holdings
    const updatedHoldings = await Promise.all(
      portfolio.holdings.map(async (holding) => {
        try {
          const quote = await getStockQuote(holding.symbol);
          return {
            ...holding,
            currentPrice: quote.price,
            marketValue: quote.price * holding.shares,
            unrealizedGain: (quote.price - holding.avgPrice) * holding.shares,
            unrealizedGainPercent: ((quote.price - holding.avgPrice) / holding.avgPrice) * 100
          };
        } catch (error) {
          console.error(`Error updating holding ${holding.symbol}:`, error);
          return holding;
        }
      })
    );

    res.json({
      ...portfolio,
      holdings: updatedHoldings
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
});

export default router; 