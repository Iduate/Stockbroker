import express from 'express';
import { offerController } from '../controllers/offerController';

const router = express.Router();

// Get all offers
router.get('/', offerController.getOffers);

// Get user-specific offers
router.get('/user', offerController.getUserOffers);

// Get a single offer
router.get('/:id', offerController.getOffer);

// Create a new offer (admin only)
router.post('/', offerController.createOffer);

// Update an offer (admin only)
router.put('/:id', offerController.updateOffer);

// Delete an offer (admin only)
router.delete('/:id', offerController.deleteOffer);

// Activate an offer
router.post('/:id/activate', offerController.activateOffer);

// Deactivate an offer
router.post('/:id/deactivate', offerController.deactivateOffer);

export const offerRoutes = router; 