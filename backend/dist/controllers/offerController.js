"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerController = void 0;
const Offer_1 = require("../models/Offer");
exports.offerController = {
    async getOffers(req, res) {
        try {
            const { status, type } = req.query;
            const query = {};
            if (status)
                query.status = status;
            if (type)
                query.type = type;
            if (status === 'active') {
                query.startDate = { $lte: new Date() };
                query.endDate = { $gte: new Date() };
            }
            const offers = await Offer_1.Offer.find(query).sort({ createdAt: -1 });
            return res.json(offers);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async getOffer(req, res) {
        try {
            const offer = await Offer_1.Offer.findById(req.params.id);
            if (!offer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            return res.json(offer);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async createOffer(req, res) {
        try {
            const { title, description, type, value, currency, conditions, startDate, endDate, targetAudience } = req.body;
            const offer = new Offer_1.Offer({
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
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async updateOffer(req, res) {
        try {
            const offer = await Offer_1.Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!offer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            return res.json(offer);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async deleteOffer(req, res) {
        try {
            const offer = await Offer_1.Offer.findByIdAndDelete(req.params.id);
            if (!offer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            return res.json({ message: 'Offer deleted successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async activateOffer(req, res) {
        try {
            const offer = await Offer_1.Offer.findById(req.params.id);
            if (!offer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            if (offer.status !== 'active') {
                offer.status = 'active';
                await offer.save();
            }
            return res.json(offer);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async deactivateOffer(req, res) {
        try {
            const offer = await Offer_1.Offer.findById(req.params.id);
            if (!offer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            if (offer.status === 'active') {
                offer.status = 'cancelled';
                await offer.save();
            }
            return res.json(offer);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    },
    async getUserOffers(req, res) {
        try {
            const user = req.user;
            const query = {
                status: 'active',
                startDate: { $lte: new Date() },
                endDate: { $gte: new Date() }
            };
            const userCreatedAt = new Date(user.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            if (userCreatedAt > thirtyDaysAgo) {
                query.targetAudience = { $in: ['all', 'new'] };
            }
            else {
                query.targetAudience = { $in: ['all', 'existing'] };
            }
            const offers = await Offer_1.Offer.find(query).sort({ createdAt: -1 });
            return res.json(offers);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    }
};
//# sourceMappingURL=offerController.js.map