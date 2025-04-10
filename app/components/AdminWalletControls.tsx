import React, { useState } from 'react';

interface AdminWalletControlsProps {
  userId: string;
  isWalletLocked: boolean;
  onLockWallet: (userId: string, locked: boolean) => Promise<void>;
  onUpdatePaymentTags: (tags: Record<string, string>) => Promise<void>;
}

export default function AdminWalletControls({
  userId,
  isWalletLocked,
  onLockWallet,
  onUpdatePaymentTags,
}: AdminWalletControlsProps) {
  const [paymentTags, setPaymentTags] = useState({
    cashapp: '',
    zelle: '',
    venmo: '',
    paypal: '',
  });

  const handleLockWallet = async () => {
    try {
      await onLockWallet(userId, !isWalletLocked);
    } catch (error) {
      console.error('Error toggling wallet lock:', error);
    }
  };

  const handleUpdateTags = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdatePaymentTags(paymentTags);
    } catch (error) {
      console.error('Error updating payment tags:', error);
    }
  };

  return (
    <div className="bg-[#1a2744] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Wallet Administration</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400">Wallet Status</span>
          <button
            onClick={handleLockWallet}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              isWalletLocked
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isWalletLocked ? 'Unlock Wallet' : 'Lock Wallet'}
          </button>
        </div>
      </div>

      <form onSubmit={handleUpdateTags}>
        <h3 className="text-lg font-medium text-white mb-4">Payment Tags</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Cash App Tag</label>
            <input
              type="text"
              value={paymentTags.cashapp}
              onChange={(e) => setPaymentTags({ ...paymentTags, cashapp: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter Cash App tag"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Zelle Tag</label>
            <input
              type="text"
              value={paymentTags.zelle}
              onChange={(e) => setPaymentTags({ ...paymentTags, zelle: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter Zelle tag"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Venmo Tag</label>
            <input
              type="text"
              value={paymentTags.venmo}
              onChange={(e) => setPaymentTags({ ...paymentTags, venmo: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter Venmo tag"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">PayPal Tag</label>
            <input
              type="text"
              value={paymentTags.paypal}
              onChange={(e) => setPaymentTags({ ...paymentTags, paypal: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter PayPal tag"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Update Payment Tags
        </button>
      </form>
    </div>
  );
} 