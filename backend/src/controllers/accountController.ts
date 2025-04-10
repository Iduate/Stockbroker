import { Request, Response } from 'express';
import { Account } from '../models/Account';
import { AppError } from '../middleware/errorHandler';

export const accountController = {
  // Get all accounts for a user
  async getAccounts(req: Request, res: Response) {
    try {
      const accounts = await Account.find({ userId: req.user.id });
      return res.json(accounts);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Get a single account
  async getAccount(req: Request, res: Response) {
    try {
      const account = await Account.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      return res.json(account);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Create a new account
  async createAccount(req: Request, res: Response) {
    try {
      const { name, type, initialBalance, currency } = req.body;

      const account = new Account({
        userId: req.user.id,
        name,
        type,
        balance: initialBalance || 0,
        currency: currency || 'USD'
      });

      await account.save();
      return res.status(201).json(account);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Update account details
  async updateAccount(req: Request, res: Response) {
    try {
      const { name, type, status } = req.body;

      const account = await Account.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { name, type, status },
        { new: true }
      );

      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      return res.json(account);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete an account
  async deleteAccount(req: Request, res: Response) {
    try {
      const account = await Account.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      return res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Update account balance
  async updateBalance(req: Request, res: Response) {
    try {
      const { amount, type } = req.body;
      const account = await Account.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      if (type === 'deposit') {
        account.balance += amount;
      } else if (type === 'withdrawal') {
        if (account.balance < amount) {
          throw new AppError('Insufficient funds', 400);
        }
        account.balance -= amount;
      } else {
        throw new AppError('Invalid transaction type', 400);
      }

      await account.save();
      return res.json(account);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      } else {
        return res.status(500).json({ message: 'Server error' });
      }
    }
  }
}; 