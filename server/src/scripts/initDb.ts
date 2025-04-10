import mongoose from 'mongoose';
import { config } from '../config';
import { User } from '../models/User';

const initDb = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const testUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-01-01'),
        selectedAccounts: ['account1', 'account2'],
        accountOwnership: 'individual'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password456',
        dateOfBirth: new Date('1992-05-15'),
        selectedAccounts: ['account3'],
        accountOwnership: 'joint'
      }
    ];

    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
    }

    console.log('Test users created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDb(); 