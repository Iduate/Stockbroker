"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const Transaction_1 = require("../models/Transaction");
const Account_1 = require("../models/Account");
const errorHandler_1 = require("../middleware/errorHandler");
exports.transactionController = {
    async getTransactions(req, res) {
        try {
            const { type, startDate, endDate, symbol } = req.query;
            const query = { userId: req.user.id };
            if (type)
                query.type = type;
            if (symbol)
                query.symbol = symbol;
            if (startDate || endDate) {
                query.date = {};
                if (startDate)
                    query.date.$gte = new Date(startDate);
                if (endDate)
                    query.date.$lte = new Date(endDate);
            }
            const transactions = await Transaction_1.Transaction.find(query)
                .sort({ date: -1 })
                .limit(100);
            return res.json(transactions);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async getTransaction(req, res) {
        try {
            const transaction = await Transaction_1.Transaction.findOne({
                _id: req.params.id,
                userId: req.user.id
            });
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            return res.json(transaction);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async createTransaction(req, res) {
        try {
            const { type, symbol, quantity, price, accountId } = req.body;
            const account = await Account_1.Account.findOne({
                _id: accountId,
                userId: req.user.id
            });
            if (!account) {
                throw new errorHandler_1.AppError('Account not found', 404);
            }
            const total = type === 'buy' || type === 'sell'
                ? quantity * price
                : quantity;
            if (type === 'buy' && account.balance < total) {
                throw new errorHandler_1.AppError('Insufficient funds', 400);
            }
            const transaction = new Transaction_1.Transaction({
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
            if (type === 'buy') {
                account.balance -= total;
            }
            else if (type === 'sell') {
                account.balance += total;
            }
            else if (type === 'deposit') {
                account.balance += total;
            }
            else if (type === 'withdrawal') {
                if (account.balance < total) {
                    throw new errorHandler_1.AppError('Insufficient funds', 400);
                }
                account.balance -= total;
            }
            await account.save();
            transaction.status = 'completed';
            await transaction.save();
            return res.status(201).json(transaction);
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            else {
                return res.status(500).json({ message: 'Server error' });
            }
        }
    },
    async cancelTransaction(req, res) {
        try {
            const transaction = await Transaction_1.Transaction.findOne({
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
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async getTransactionSummary(req, res) {
        try {
            const summary = await Transaction_1.Transaction.aggregate([
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
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    }
};
//# sourceMappingURL=transactionController.js.map