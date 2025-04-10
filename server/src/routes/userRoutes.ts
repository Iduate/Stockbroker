import express from 'express';
import { auth } from '../middleware/auth';
import {
  getCurrentUser,
  updateSelectedAccounts,
  updateAccountOwnership
} from '../controllers/userController';

const router = express.Router();

// Get current user
router.get('/me', auth, getCurrentUser);

// Update selected accounts
router.put('/selected-accounts', auth, updateSelectedAccounts);

// Update account ownership
router.put('/account-ownership', auth, updateAccountOwnership);

export default router; 