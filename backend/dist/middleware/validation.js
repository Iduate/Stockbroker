"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfileUpdate = exports.validateLogin = exports.validateRegistration = void 0;
const validateRegistration = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    return next();
};
exports.validateRegistration = validateRegistration;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    return next();
};
exports.validateLogin = validateLogin;
const validateProfileUpdate = (req, res, next) => {
    const { firstName, lastName, phoneNumber } = req.body;
    if (firstName && typeof firstName !== 'string') {
        return res.status(400).json({ message: 'First name must be a string' });
    }
    if (lastName && typeof lastName !== 'string') {
        return res.status(400).json({ message: 'Last name must be a string' });
    }
    if (phoneNumber) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }
    }
    return next();
};
exports.validateProfileUpdate = validateProfileUpdate;
//# sourceMappingURL=validation.js.map