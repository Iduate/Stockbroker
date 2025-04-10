import React from 'react';
import { Button, Card } from './ui';
import { formatCurrency } from '../lib/utils';
import Link from 'next/link';
import { FaWallet } from 'react-icons/fa';

interface WalletCardProps {
  balance: number;
  currency: string;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  currency,
  onDeposit,
  onWithdraw,
}) => {
  return (
    <div className="bg-[#132F4C] rounded-lg p-6 text-white">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaWallet className="text-2xl text-blue-400" />
            <h2 className="text-xl font-semibold">Wallet Balance</h2>
          </div>
          <Link href="/history">
            <Button variant="secondary" size="sm">
              View History
            </Button>
          </Link>
        </div>
        
        <div className="text-3xl font-bold text-blue-400">
          {formatCurrency(balance, currency)}
        </div>
        
        <div className="flex space-x-4">
          <Button onClick={onDeposit} className="flex-1 bg-blue-500 hover:bg-blue-600">
            Deposit
          </Button>
          <Button 
            onClick={onWithdraw} 
            variant="secondary" 
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
          >
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard; 