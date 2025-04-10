import { Request, Response } from 'express';
import { Offer } from '../models/Offer';
import { AppError } from '../middleware/errorHandler';

export const offerController = {
  // Get all offers
  async getOffers(req: Request, res: Response) {
    try {
      const { status, type } = req.query;
      const query: any = {};

      if (status) query.status = status;
      if (type) query.type = type;

      // Add date filter for active offers
      if (status === 'active') {
        query.startDate = { $lte: new Date() };
        query.endDate = { $gte: new Date() };
      }

      const offers = await Offer.find(query).sort({ createdAt: -1 });
      return res.json(offers);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Get a single offer
  async getOffer(req: Request, res: Response) {
    try {
      const offer = await Offer.findById(req.params.id);

      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }

      return res.json(offer);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Create a new offer (admin only)
  async createOffer(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        type,
        value,
        currency,
        conditions,
        startDate,
        endDate,
        targetAudience
      } = req.body;

      const offer = new Offer({
        title,
        description,
        type,
        value,
        currency,
        conditions,
        startDate,
        endDate,
        targetAudience
      });

      await offer.save();
      return res.status(201).json(offer);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Update an offer (admin only)
  async updateOffer(req: Request, res: Response) {
    try {
      const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }

      return res.json(offer);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete an offer (admin only)
  async deleteOffer(req: Request, res: Response) {
    try {
      const offer = await Offer.findByIdAndDelete(req.params.id);

      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }

      return res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Activate an offer
  async activateOffer(req: Request, res: Response) {
    try {
      const offer = await Offer.findById(req.params.id);

      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }

      if (offer.status !== 'active') {
        offer.status = 'active';
        await offer.save();
      }

      return res.json(offer);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Deactivate an offer
  async deactivateOffer(req: Request, res: Response) {
    try {
      const offer = await Offer.findById(req.params.id);

      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }

      if (offer.status === 'active') {
        offer.status = 'cancelled';
        await offer.save();
      }

      return res.json(offer);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Get user-specific offers
  async getUserOffers(req: Request, res: Response) {
    try {
      const user = req.user;
      const query: any = {
        status: 'active',
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      };

      // Filter based on user type (new/existing)
      const userCreatedAt = new Date(user.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (userCreatedAt > thirtyDaysAgo) {
        query.targetAudience = { $in: ['all', 'new'] };
      } else {
        query.targetAudience = { $in: ['all', 'existing'] };
      }

      const offers = await Offer.find(query).sort({ createdAt: -1 });
      return res.json(offers);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
}; 