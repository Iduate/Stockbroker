import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button, Input } from './ui';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
}) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateOrder = async () => {
    try {
      setError('');
      setIsLoading(true);

      const response = await fetch('/api/wallet/deposit/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create deposit order');
      }

      const data = await response.json();
      
      // Redirect to PayPal approval URL
      window.location.href = data.approvalUrl;
      
    } catch (err) {
      console.error('Error creating deposit order:', err);
      setError('Failed to process deposit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Deposit Funds
          </Dialog.Title>

          <div className="mt-4">
            <Input
              type="number"
              label="Amount (USD)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              error={error}
            />
          </div>

          <div className="mt-6 flex space-x-3">
            <Button
              onClick={handleCreateOrder}
              disabled={!amount || isLoading || parseFloat(amount) <= 0}
              className="flex-1"
            >
              {isLoading ? 'Processing...' : 'Continue to PayPal'}
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DepositModal; 