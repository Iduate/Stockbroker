import express from 'express';
import paypal from '@paypal/checkout-server-sdk';
import { prisma } from '../prisma.js';

const router = express.Router();

// PayPal configuration
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let paypalClient = new paypal.core.PayPalHttpClient(environment);

// Get wallet balance
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let wallet = await prisma.wallet.findFirst({
      where: { userId },
      include: {
        deposits: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        withdrawals: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          currency: 'USD'
        },
        include: {
          deposits: true,
          withdrawals: true
        }
      });
    }

    res.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ message: 'Error fetching wallet details' });
  }
});

// Create PayPal order for deposit
router.post('/deposit/create-order', async (req, res) => {
  try {
    const { userId, amount, currency = 'USD' } = req.body;

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency.toUpperCase(),
          value: amount.toString()
        },
        description: 'Stock Trading App Wallet Deposit'
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/wallet/deposit/success`,
        cancel_url: `${process.env.FRONTEND_URL}/wallet/deposit/cancel`,
        user_action: 'PAY_NOW',
        brand_name: 'Stock Trading App'
      }
    });

    // Execute the order creation
    const order = await paypalClient.execute(request);

    // Create a pending deposit record
    const deposit = await prisma.deposit.create({
      data: {
        wallet: {
          connect: {
            userId
          }
        },
        amount: parseFloat(amount),
        status: 'PENDING',
        method: 'PAYPAL',
        reference: order.result.id
      }
    });

    res.json({
      orderId: order.result.id,
      depositId: deposit.id,
      approvalUrl: order.result.links.find(link => link.rel === 'approve').href
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ message: 'Error processing deposit request' });
  }
});

// Capture PayPal payment
router.post('/deposit/capture', async (req, res) => {
  try {
    const { orderId, depositId } = req.body;

    // Create capture request
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    // Execute the capture
    const capture = await paypalClient.execute(request);

    if (capture.result.status !== 'COMPLETED') {
      throw new Error('Payment not completed');
    }

    // Update deposit and wallet in a transaction
    const deposit = await prisma.$transaction(async (tx) => {
      // Get the deposit
      const deposit = await tx.deposit.findUnique({
        where: { id: depositId },
        include: { wallet: true }
      });

      if (!deposit) {
        throw new Error('Deposit not found');
      }

      if (deposit.status !== 'PENDING') {
        throw new Error('Deposit already processed');
      }

      // Update deposit status
      const updatedDeposit = await tx.deposit.update({
        where: { id: depositId },
        data: { status: 'COMPLETED' }
      });

      // Update wallet balance
      await tx.wallet.update({
        where: { id: deposit.wallet.id },
        data: {
          balance: {
            increment: deposit.amount
          }
        }
      });

      return updatedDeposit;
    });

    res.json({
      message: 'Deposit completed successfully',
      deposit
    });
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    res.status(500).json({ message: 'Error confirming deposit' });
  }
});

// Get transaction history
router.get('/:userId/transactions', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const wallet = await prisma.wallet.findFirst({
      where: { userId }
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Get deposits and withdrawals
    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.withdrawal.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      })
    ]);

    // Combine and sort transactions
    const transactions = [...deposits, ...withdrawals]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, parseInt(limit));

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
});

export default router; 