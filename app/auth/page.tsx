'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AccountType {
  id: string;
  title: string;
  icon: string;
}

const accountTypes: AccountType[] = [
  {
    id: 'retirement',
    title: 'Retirement and IRAs',
    icon: '🏦'
  },
  {
    id: 'health',
    title: 'Health Saving',
    icon: '🏥'
  },
  {
    id: 'inheritance',
    title: 'Inheritance Account',
    icon: '💰'
  },
  {
    id: 'brokerage',
    title: 'Brokerage Account',
    icon: '📈'
  },
  {
    id: 'college',
    title: 'College Savings Plans',
    icon: '🎓'
  }
];

export default function AccountSelectionPage() {
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(accountId)) {
        newSelection.delete(accountId);
      } else {
        newSelection.add(accountId);
      }
      return newSelection;
    });
    setError(null);
  };

  const handleContinue = async () => {
    if (selectedAccounts.size === 0) {
      setError('Please select at least one account type to continue');
      return;
    }

    try {
      // Store the complete account information for selected accounts
      const selectedAccountsInfo = accountTypes
        .filter(account => selectedAccounts.has(account.id))
        .map(({ id, title }) => ({ id, title }));

      localStorage.setItem('selectedAccountTypes', JSON.stringify(selectedAccountsInfo));
      router.push('/auth/register');
    } catch (err) {
      setError('Failed to save account selection. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-4">StocklyInvestor.com</h1>
        <p className="text-xl text-gray-400 text-center mb-12">
          Select the types of accounts you'd like to manage
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {accountTypes.map((account) => (
            <div
              key={account.id}
              onClick={() => toggleAccount(account.id)}
              className={`flex items-center p-6 rounded-lg cursor-pointer transition-all
                ${selectedAccounts.has(account.id)
                  ? 'bg-[#1a365d] border-2 border-green-500' 
                  : 'bg-[#172a46] hover:bg-[#1a365d]'}`}
            >
              <div className="text-2xl mr-4">{account.icon}</div>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{account.title}</h2>
                <p className="text-sm text-gray-400">
                  {selectedAccounts.has(account.id) ? 'Selected' : 'Click to select'}
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${selectedAccounts.has(account.id)
                  ? 'border-green-500 bg-green-500' 
                  : 'border-gray-400'}`}
              >
                {selectedAccounts.has(account.id) && (
                  <div className="w-3 h-3 text-white">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className={`w-full font-bold py-4 rounded-lg transition-colors text-lg
            ${selectedAccounts.size > 0
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          Continue to Registration →
        </button>

        <div className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-400">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
} 