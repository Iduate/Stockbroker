import { Request, Response } from 'express';
import { z } from 'zod';
import { UserService } from '../services/userService';
import { AuthRequest } from '../middleware/auth';

const updateSelectedAccountsSchema = z.object({
  selectedAccounts: z.array(z.string())
});

const updateAccountOwnershipSchema = z.object({
  accountOwnership: z.string()
});

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await UserService.getUserById(req.userId);
    
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      selectedAccounts: user.selectedAccounts,
      accountOwnership: user.accountOwnership
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      message: 'An error occurred while fetching user data'
    });
  }
};

export const updateSelectedAccounts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const validatedData = updateSelectedAccountsSchema.parse(req.body);
    
    const user = await UserService.updateSelectedAccounts(
      req.userId,
      validatedData.selectedAccounts
    );

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      selectedAccounts: user.selectedAccounts,
      accountOwnership: user.accountOwnership
    };

    res.json({
      message: 'Selected accounts updated successfully',
      user: userData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Update selected accounts error:', error);
    res.status(500).json({
      message: 'An error occurred while updating selected accounts'
    });
  }
};

export const updateAccountOwnership = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const validatedData = updateAccountOwnershipSchema.parse(req.body);
    
    const user = await UserService.updateAccountOwnership(
      req.userId,
      validatedData.accountOwnership
    );

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      selectedAccounts: user.selectedAccounts,
      accountOwnership: user.accountOwnership
    };

    res.json({
      message: 'Account ownership updated successfully',
      user: userData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Update account ownership error:', error);
    res.status(500).json({
      message: 'An error occurred while updating account ownership'
    });
  }
}; 