import express from 'express';
import { userController } from '../controllers/userController';
import { validateRegistration, validateLogin, validateProfileUpdate } from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, userController.register);
router.post('/login', validateLogin, userController.login);

// Protected routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateProfileUpdate, userController.updateProfile);
router.put('/password', userController.updatePassword);
router.put('/notifications', userController.updateNotifications);

export const userRoutes = router; 