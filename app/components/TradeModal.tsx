'use client';

import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tradeData: {
    type: 'buy' | 'sell';
    symbol: string;
    quantity: number;
    price: number;
  }) => void;
}

export default function TradeModal({ isOpen, onClose, onSubmit }: TradeModalProps) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingTradeData, setPendingTradeData] = useState<{
    type: 'buy' | 'sell';
    symbol: string;
    quantity: number;
    price: number;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!symbol || !quantity || !price) {
      setError('All fields are required');
      return;
    }

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price');
      return;
    }

    const tradeData = {
      type: tradeType,
      symbol: symbol.toUpperCase(),
      quantity: quantityNum,
      price: priceNum,
    };

    if (tradeType === 'buy') {
      // For buy orders, show payment modal
      setPendingTradeData(tradeData);
      setShowPaymentModal(true);
    } else {
      // For sell orders, proceed directly
      onSubmit(tradeData);
      resetForm();
    }
  };

  const handlePaymentComplete = () => {
    if (pendingTradeData) {
      onSubmit(pendingTradeData);
      resetForm();
    }
  };

  const resetForm = () => {
    setSymbol('');
    setQuantity('');
    setPrice('');
    setTradeType('buy');
    setPendingTradeData(null);
  };

  const calculateTotal = () => {
    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);
    if (!isNaN(quantityNum) && !isNaN(priceNum)) {
      return quantityNum * priceNum;
    }
    return 0;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1B2B3A] rounded-xl border border-white/10 p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Place Order</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  tradeType === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                onClick={() => setTradeType('buy')}
              >
                Buy
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  tradeType === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                onClick={() => setTradeType('sell')}
              >
                Sell
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Symbol
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock symbol"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                min="1"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                min="0.01"
                step="0.01"
              />
            </div>

            {(quantity !== '' && price !== '') && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-white font-medium">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                tradeType === 'buy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {tradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </button>
          </form>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={calculateTotal()}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
} 