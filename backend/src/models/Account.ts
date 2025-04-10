import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'cash' | 'margin';
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['cash', 'margin'],
    default: 'cash'
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for faster queries
accountSchema.index({ userId: 1 });

export const Account = mongoose.model<IAccount>('Account', accountSchema); 