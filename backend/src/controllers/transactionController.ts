import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { AppError } from '../middleware/errorHandler';

export const transactionController = {
  // Get all transactions for a user
  async getTransactions(req: Request, res: Response) {
    try {
      const { type, startDate, endDate, symbol } = req.query;
      const query: any = { userId: req.user.id };

      if (type) query.type = type;
      if (symbol) query.symbol = symbol;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate as string);
        if (endDate) query.date.$lte = new Date(endDate as string);
      }

      const transactions = await Transaction.find(query)
        .sort({ date: -1 })
        .limit(100);

      return res.json(transactions);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Get a single transaction
  async getTransaction(req: Request, res: Response) {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      return res.json(transaction);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Create a new transaction
  async createTransaction(req: Request, res: Response) {
    try {
      const { type, symbol, quantity, price, accountId } = req.body;

      // Validate account ownership
      const account = await Account.findOne({
        _id: accountId,
        userId: req.user.id
      });

      if (!account) {
        throw new AppError('Account not found', 404);
      }

      // Calculate total
      const total = type === 'buy' || type === 'sell'
        ? quantity * price
        : quantity;

      // Check sufficient funds for buy orders
      if (type === 'buy' && account.balance < total) {
        throw new AppError('Insufficient funds', 400);
      }

      // Create transaction
      const transaction = new Transaction({
        userId: req.user.id,
        accountId,
        type,
        symbol,
        quantity,
        price,
        total,
        status: 'pending'
      });

      await transaction.save();

      // Update account balance
      if (type === 'buy') {
        account.balance -= total;
      } else if (type === 'sell') {
        account.balance += total;
      } else if (type === 'deposit') {
        account.balance += total;
      } else if (type === 'withdrawal') {
        if (account.balance < total) {
          throw new AppError('Insufficient funds', 400);
        }
        account.balance -= total;
      }

      await account.save();

      // Update transaction status
      transaction.status = 'completed';
      await transaction.save();

      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      } else {
        return res.status(500).json({ message: 'Server error' });
      }
    }
  },

  // Cancel a transaction
  async cancelTransaction(req: Request, res: Response) {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId: req.user.id,
        status: 'pending'
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found or cannot be cancelled' });
      }

      transaction.status = 'cancelled';
      await transaction.save();

      return res.json(transaction);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Get transaction summary
  async getTransactionSummary(req: Request, res: Response) {
    try {
      const summary = await Transaction.aggregate([
        { $match: { userId: req.user.id } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalAmount: { $sum: '$total' }
          }
        }
      ]);

      return res.json(summary);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
}; 