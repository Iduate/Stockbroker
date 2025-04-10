import { Request, Response, NextFunction } from 'express';

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password validation
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  return next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  return next();
};

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
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