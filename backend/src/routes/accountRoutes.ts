import express from 'express';
import { accountController } from '../controllers/accountController';

const router = express.Router();

// Get all accounts
router.get('/', accountController.getAccounts);

// Get a single account
router.get('/:id', accountController.getAccount);

// Create a new account
router.post('/', accountController.createAccount);

// Update account details
router.put('/:id', accountController.updateAccount);

// Delete an account
router.delete('/:id', accountController.deleteAccount);

// Update account balance
router.patch('/:id/balance', accountController.updateBalance);

export const accountRoutes = router; 