export interface User {
  id: string;
  email: string;
  name: string;
  balance: {
    available: number;
    pending: number;
  };
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'crypto';
  details: CardDetails | BankDetails | CryptoDetails;
  isDefault: boolean;
}

export interface CardDetails {
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface BankDetails {
  bankName: string;
  accountLast4: string;
  accountType: 'checking' | 'savings';
}

export interface CryptoDetails {
  walletAddress: string;
  network: string;
  currency: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'trade';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
} 