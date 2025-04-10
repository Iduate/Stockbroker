import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/emailService';

export const userController = {
  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const { firstName, lastName, phoneNumber } = req.body;
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;

      await user.save();
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Update password
  async updatePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      // Send email notification
      await sendEmail({
        to: user.email,
        subject: 'Password Updated',
        text: 'Your password has been successfully updated.'
      });

      return res.json({ message: 'Password updated successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Update notification preferences
  async updateNotifications(req: Request, res: Response) {
    try {
      const { email, push, sms } = req.body;
      const user = await User.findById(req.user.id);

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
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Register new user
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phoneNumber } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      user = new User({
        email,
        password,
        firstName,
        lastName,
        phoneNumber
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      // Send welcome email
      await sendEmail({
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
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
}; 