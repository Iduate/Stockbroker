import React, { useState } from 'react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onWithdraw: (method: string, amount: number, details: any) => Promise<void>;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  requiresDetails: boolean;
  detailsLabel?: string;
  placeholder?: string;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
  balance,
  onWithdraw,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', requiresDetails: true, detailsLabel: 'Bank Details', placeholder: 'Account Number, Routing Number, Bank Name' },
    { id: 'cashapp', name: 'Cash App', icon: '💵', requiresDetails: true, detailsLabel: 'Cash App Tag', placeholder: 'Enter your Cash App tag' },
    { id: 'zelle', name: 'Zelle', icon: '💸', requiresDetails: true, detailsLabel: 'Zelle Tag', placeholder: 'Enter your Zelle tag' },
    { id: 'venmo', name: 'Venmo', icon: '💳', requiresDetails: true, detailsLabel: 'Venmo Tag', placeholder: 'Enter your Venmo tag' },
    { id: 'paypal', name: 'PayPal', icon: '💰', requiresDetails: true, detailsLabel: 'PayPal Tag', placeholder: 'Enter your PayPal tag' },
    { id: 'bitcoin', name: 'Bitcoin', icon: '₿', requiresDetails: true, detailsLabel: 'Bitcoin Wallet Address', placeholder: 'Enter your Bitcoin wallet address' },
    { id: 'ethereum', name: 'Ethereum', icon: 'Ξ', requiresDetails: true, detailsLabel: 'Ethereum Wallet Address', placeholder: 'Enter your Ethereum wallet address' },
    { id: 'usdt', name: 'USDT', icon: '💱', requiresDetails: true, detailsLabel: 'USDT Wallet Address', placeholder: 'Enter your USDT wallet address' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !amount) return;

    try {
      setIsSubmitting(true);
      await onWithdraw(selectedMethod, parseFloat(amount), details);
      setAmount('');
      setDetails('');
      setSelectedMethod(null);
      onClose();
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1a2744] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="text-gray-400 mb-2">Available Balance</div>
            <div className="text-2xl font-bold text-white mb-4">${balance.toFixed(2)}</div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Amount to Withdraw</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter amount"
                min="0"
                max={balance}
                step="0.01"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors ${
                      selectedMethod === method.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span>{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedMethod && paymentMethods.find(m => m.id === selectedMethod)?.requiresDetails && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  {paymentMethods.find(m => m.id === selectedMethod)?.detailsLabel}
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder={paymentMethods.find(m => m.id === selectedMethod)?.placeholder}
                  required
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedMethod || !amount}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 