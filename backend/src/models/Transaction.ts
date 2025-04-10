import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell', 'deposit', 'withdrawal'],
    required: true
  },
  symbol: {
    type: String,
    required: function() {
      return this.type === 'buy' || this.type === 'sell';
    }
  },
  quantity: {
    type: Number,
    required: function() {
      return this.type === 'buy' || this.type === 'sell';
    }
  },
  price: {
    type: Number,
    required: function() {
      return this.type === 'buy' || this.type === 'sell';
    }
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
transactionSchema.index({ userId: 1 });
transactionSchema.index({ accountId: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ symbol: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema); 