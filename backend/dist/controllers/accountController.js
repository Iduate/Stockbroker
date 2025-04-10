"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountController = void 0;
const Account_1 = require("../models/Account");
const errorHandler_1 = require("../middleware/errorHandler");
exports.accountController = {
    async getAccounts(req, res) {
        try {
            const accounts = await Account_1.Account.find({ userId: req.user.id });
            return res.json(accounts);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async getAccount(req, res) {
        try {
            const account = await Account_1.Account.findOne({
                _id: req.params.id,
                userId: req.user.id
            });
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            return res.json(account);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async createAccount(req, res) {
        try {
            const { name, type, initialBalance, currency } = req.body;
            const account = new Account_1.Account({
                userId: req.user.id,
                name,
                type,
                balance: initialBalance || 0,
                currency: currency || 'USD'
            });
            await account.save();
            return res.status(201).json(account);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async updateAccount(req, res) {
        try {
            const { name, type, status } = req.body;
            const account = await Account_1.Account.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { name, type, status }, { new: true });
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            return res.json(account);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async deleteAccount(req, res) {
        try {
            const account = await Account_1.Account.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.id
            });
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            return res.json({ message: 'Account deleted successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async updateBalance(req, res) {
        try {
            const { amount, type } = req.body;
            const account = await Account_1.Account.findOne({
                _id: req.params.id,
                userId: req.user.id
            });
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            if (type === 'deposit') {
                account.balance += amount;
            }
            else if (type === 'withdrawal') {
                if (account.balance < amount) {
                    throw new errorHandler_1.AppError('Insufficient funds', 400);
                }
                account.balance -= amount;
            }
            else {
                throw new errorHandler_1.AppError('Invalid transaction type', 400);
            }
            await account.save();
            return res.json(account);
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            else {
                return res.status(500).json({ message: 'Server error' });
            }
        }
    }
};
//# sourceMappingURL=accountController.js.map