'use client';

import type { MarketData } from '../services/marketData';

// Static data moved outside component
const staticStocks: MarketData[] = [
  { 
    symbol: 'AAPL', 
    name: 'Apple Inc.', 
    price: 169.00, 
    change: 0.67, 
    changePercent: 0.67, 
    sector: 'Technology',
    minimumPrice: 152.10
  },
  { 
    symbol: 'MSFT', 
    name: 'Microsoft Corp.', 
    price: 425.00, 
    change: 2.15, 
    changePercent: 0.51, 
    sector: 'Technology',
    minimumPrice: 382.50
  },
  { 
    symbol: 'GOOGL', 
    name: 'Alphabet Inc.', 
    price: 147.00, 
    change: 1.23, 
    changePercent: 0.84, 
    sector: 'Technology',
    minimumPrice: 132.30
  },
  { 
    symbol: 'AMZN', 
    name: 'Amazon.com Inc.', 
    price: 178.00, 
    change: -0.89, 
    changePercent: -0.50, 
    sector: 'Technology',
    minimumPrice: 160.20
  },
  { 
    symbol: 'META', 
    name: 'Meta Platforms Inc.', 
    price: 500.00, 
    change: 3.45, 
    changePercent: 0.69, 
    sector: 'Technology',
    minimumPrice: 450.00
  }
];

export default function FeaturedStocks() {
  return (
    <div className="space-y-4">
      {staticStocks.map(stock => (
        <div key={stock.symbol} className="flex justify-between items-center">
          <div>
            <p className="font-semibold">{stock.symbol}</p>
            <p className="text-sm text-gray-400">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${stock.price.toFixed(2)}</p>
            <p className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
            </p>
          </div>
        </div>
      ))}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          * Stock data updates every 5 minutes
        </p>
      </div>
    </div>
  );
} 