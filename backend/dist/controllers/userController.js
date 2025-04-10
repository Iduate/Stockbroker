"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../utils/emailService");
exports.userController = {
    async getProfile(req, res) {
        try {
            const user = await User_1.User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async updateProfile(req, res) {
        try {
            const { firstName, lastName, phoneNumber } = req.body;
            const user = await User_1.User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.phoneNumber = phoneNumber || user.phoneNumber;
            await user.save();
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User_1.User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            user.password = newPassword;
            await user.save();
            await (0, emailService_1.sendEmail)({
                to: user.email,
                subject: 'Password Updated',
                text: 'Your password has been successfully updated.'
            });
            return res.json({ message: 'Password updated successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async updateNotifications(req, res) {
        try {
            const { email, push, sms } = req.body;
            const user = await User_1.User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.notifications = {
                email: email !== undefined ? email : user.notifications.email,
                push: push !== undefined ? push : user.notifications.push,
                sms: sms !== undefined ? sms : user.notifications.sms
            };
            await user.save();
            return res.json(user.notifications);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, phoneNumber } = req.body;
            let user = await User_1.User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
            user = new User_1.User({
                email,
                password,
                firstName,
                lastName,
                phoneNumber
            });
            await user.save();
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            await (0, emailService_1.sendEmail)({
                to: user.email,
                subject: 'Welcome to Stock Trading App',
                text: `Welcome ${user.firstName}! Thank you for joining our platform.`
            });
            return res.status(201).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    }
};
//# sourceMappingURL=userController.js.map