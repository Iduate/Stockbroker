import axios from 'axios';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../firebase/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const db = getFirestore(app);

export interface RegisterUserData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  phoneNumber: string;
  email: string;
  password: string;
  selectedAccounts: Array<{ id: string; title: string }>;
  accountOwnership: 'individual' | 'shared';
}

export const authService = {
  async register(userData: RegisterUserData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create account');
    }
  }
}; 