import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  country: string;
  phoneNumber: string;
  email: string;
  password: string;
  selectedAccounts: Array<{
    id: string;
    title: string;
  }>;
  accountOwnership: 'individual' | 'shared';
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  selectedAccounts: [{
    id: { type: String, required: true },
    title: { type: String, required: true }
  }],
  accountOwnership: {
    type: String,
    enum: ['individual', 'shared'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 