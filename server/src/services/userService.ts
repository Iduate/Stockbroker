import { User } from '../models/User';
import { Types } from 'mongoose';

export class UserService {
  static async getUserById(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async updateSelectedAccounts(userId: string, selectedAccounts: string[]) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { selectedAccounts } },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async updateAccountOwnership(userId: string, accountOwnership: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { accountOwnership } },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
} 