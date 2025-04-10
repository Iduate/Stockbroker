import express from 'express';
import { transactionController } from '../controllers/transactionController';

const router = express.Router();

// Get all transactions
router.get('/', transactionController.getTransactions);

// Get transaction summary
router.get('/summary', transactionController.getTransactionSummary);

// Get a single transaction
router.get('/:id', transactionController.getTransaction);

// Create a new transaction
router.post('/', transactionController.createTransaction);

// Cancel a transaction
router.post('/:id/cancel', transactionController.cancelTransaction);

export const transactionRoutes = router; 