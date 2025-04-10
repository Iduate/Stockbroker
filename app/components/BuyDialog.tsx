'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuthStore } from '../store/authStore';
import { Stock } from '../types';

interface BuyDialogProps {
  stock: Stock;
  onClose: () => void;
  onBuy: (quantity: number) => void;
}

export function BuyDialog({ stock, onClose, onBuy }: BuyDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  const handleBuy = () => {
    onBuy(quantity);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy {stock.symbol}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="quantity" className="text-right">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="payment" className="text-right">
              Payment
            </label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Total</label>
            <div className="col-span-3">
              ${(stock.price * quantity).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBuy}>
            Buy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 