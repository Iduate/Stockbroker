import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, email },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router; 