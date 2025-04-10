import React from 'react';

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockPrice: number;
  quantity: number;
}

export default function PaymentMethodsModal({
  isOpen,
  onClose,
  stockSymbol,
  stockPrice,
  quantity,
}: PaymentMethodsModalProps) {
  if (!isOpen) return null;

  const totalAmount = stockPrice * quantity;

  const paymentMethods = [
    { name: 'Bank Transfer', icon: '🏦' },
    { name: 'Cash App', icon: '💵' },
    { name: 'Zelle', icon: '💸' },
    { name: 'Venmo', icon: '💳' },
    { name: 'PayPal', icon: '💰' },
    { name: 'Bitcoin', icon: '₿' },
    { name: 'Ethereum', icon: 'Ξ' },
    { name: 'USDT', icon: '💱' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1a2744] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="text-gray-400 mb-2">Order Summary</div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Stock:</span>
              <span className="text-white">{stockSymbol}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Quantity:</span>
              <span className="text-white">{quantity}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Price per share:</span>
              <span className="text-white">${stockPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-white">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-gray-400 mb-4">Select Payment Method</div>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.name}
                className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors"
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-white">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
} 