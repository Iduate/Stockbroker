'use client';

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { User } from '@/app/types/user';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: () => void;
  user: User;
}

export default function PaymentModal({ isOpen, onClose, amount, onPaymentComplete, user }: PaymentModalProps) {
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'bank' | 'crypto'>('paypal');

  const handleBankTransfer = async () => {
    setError('');
    setProcessing(true);

    try {
      const response = await fetch('/api/payment/bank-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          userId: user.id,
          accountName: user.name,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      onPaymentComplete();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    setError('');
    setProcessing(true);

    try {
      const response = await fetch('/api/payment/crypto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Show crypto payment address and amount
      setError(`Please send ${data.cryptoAmount} ${data.currency} to ${data.address}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate crypto payment');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1B2B3A] rounded-xl border border-white/10 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Payment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="text-gray-400">Amount to Pay</div>
          <div className="text-2xl font-bold text-white">${amount.toFixed(2)}</div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                paymentMethod === 'paypal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              PayPal
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                paymentMethod === 'bank'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Bank Transfer
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('crypto')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                paymentMethod === 'crypto'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Crypto
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {paymentMethod === 'paypal' && (
            <PayPalScriptProvider options={{ 
              "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
              currency: "USD"
            }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount.toString(),
                          currency_code: "USD"
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  if (actions.order) {
                    const order = await actions.order.capture();
                    // Handle successful payment
                    onPaymentComplete();
                    onClose();
                  }
                }}
                onError={(err) => {
                  setError('PayPal payment failed. Please try again.');
                  console.error('PayPal Error:', err);
                }}
              />
            </PayPalScriptProvider>
          )}

          {paymentMethod === 'bank' && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Bank Transfer Details</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>Bank: Your Trading Bank</p>
                  <p>Account Name: Trading Account</p>
                  <p>Account Number: XXXX-XXXX-XXXX</p>
                  <p>Reference: {user.id}</p>
                </div>
              </div>
              <button
                onClick={handleBankTransfer}
                disabled={processing}
                className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Confirm Bank Transfer'}
              </button>
            </div>
          )}

          {paymentMethod === 'crypto' && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Cryptocurrency Payment</h3>
                <div className="space-y-2">
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                    defaultValue="BTC"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleCryptoPayment}
                disabled={processing}
                className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Generating Address...' : 'Pay with Crypto'}
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
} 