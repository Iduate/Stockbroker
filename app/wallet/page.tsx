'use client';

import React, { useState, useEffect } from 'react';
import WalletCard from '../components/WalletCard';
import DepositModal from '../components/DepositModal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [walletData, setWalletData] = useState({
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchWalletData();
    }
  }, [status, router]);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/wallet');
      if (!response.ok) throw new Error('Failed to fetch wallet data');
      
      const data = await response.json();
      setWalletData(data);
    } catch (err) {
      setError('Failed to load wallet data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = () => {
    setIsDepositModalOpen(true);
  };

  const handleDepositSuccess = () => {
    setIsDepositModalOpen(false);
    fetchWalletData(); // Refresh wallet data after successful deposit
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Wallet</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <WalletCard
            balance={walletData.balance}
            currency="USD"
            onDeposit={handleDeposit}
            onWithdraw={() => {}} // Implement withdrawal functionality later
          />
        </div>
      </div>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={handleDepositSuccess}
        userId={session?.user?.id || ''}
      />
    </div>
  );
} 