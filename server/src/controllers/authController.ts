import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { z } from 'zod';
import { config } from '../config';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  country: z.string().min(1, 'Country is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  selectedAccounts: z.array(z.object({
    id: z.string(),
    title: z.string()
  })),
  accountOwnership: z.enum(['individual', 'shared'])
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      ...validatedData,
      dateOfBirth: new Date(validatedData.dateOfBirth)
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    // Return user data and token
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      selectedAccounts: user.selectedAccounts,
      accountOwnership: user.accountOwnership
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      message: 'An error occurred during registration'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(validatedData.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    // Return user data and token
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      selectedAccounts: user.selectedAccounts,
      accountOwnership: user.accountOwnership
    };

    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      message: 'An error occurred during login'
    });
  }
}; 