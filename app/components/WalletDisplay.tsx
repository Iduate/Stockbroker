import React, { useState } from 'react';
import WithdrawalModal from './WithdrawalModal';

interface WalletDisplayProps {
  balance: number;
  isLocked: boolean;
  isAdmin?: boolean;
  onWithdraw: (method: string, amount: number, details: any) => Promise<void>;
}

export default function WalletDisplay({
  balance,
  isLocked,
  isAdmin = false,
  onWithdraw,
}: WalletDisplayProps) {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  return (
    <div className="bg-[#1a2744] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Wallet Balance</h2>
        {isLocked && (
          <span className="flex items-center text-yellow-400">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Wallet Locked
          </span>
        )}
      </div>

      <div className="text-3xl font-bold text-white mb-6">
        ${balance.toFixed(2)}
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShowWithdrawalModal(true)}
          disabled={isLocked}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            isLocked
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLocked ? 'Withdrawals Disabled' : 'Withdraw Funds'}
        </button>

        {isAdmin && (
          <button
            onClick={() => {/* Open admin controls modal */}}
            className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Admin Controls
          </button>
        )}
      </div>

      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        balance={balance}
        onWithdraw={onWithdraw}
      />
    </div>
  );
} 