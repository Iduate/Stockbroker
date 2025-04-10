import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  description: string;
  type: 'bonus' | 'discount' | 'commission' | 'referral';
  value: number;
  currency: string;
  conditions: string[];
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  targetAudience: 'all' | 'new' | 'existing';
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bonus', 'discount', 'commission', 'referral'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  conditions: [{
    type: String,
    required: true
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'new', 'existing'],
    default: 'all'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
offerSchema.index({ status: 1 });
offerSchema.index({ startDate: 1, endDate: 1 });
offerSchema.index({ type: 1 });

export const Offer = mongoose.model<IOffer>('Offer', offerSchema); 