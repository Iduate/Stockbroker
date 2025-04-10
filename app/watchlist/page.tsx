'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaChartLine, FaTimes } from 'react-icons/fa';
import { watchlistService } from '../services/watchlist';
import { stockAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import StockDetailModal from '../components/StockDetailModal';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  addedAt: number;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [selectedStock, setSelectedStock] = useState<WatchlistItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWatchlist = () => {
      const items = watchlistService.getItems();
      setWatchlist(items);
      setIsLoading(false);
    };

    loadWatchlist();
    const unsubscribe = watchlistService.addListener(loadWatchlist);
    return () => unsubscribe();
  }, []);

  const removeFromWatchlist = (symbol: string) => {
    watchlistService.removeItem(symbol);
    toast.success('Removed from watchlist');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <div className="text-white">Loading watchlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Watchlist</h1>
          <div className="text-gray-400">
            {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'}
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <FaStar className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-400">Your watchlist is empty</p>
            <p className="text-gray-500 text-sm mt-2">
              Add stocks to your watchlist to track their performance
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item) => (
              <div
                key={item.symbol}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.symbol}</h3>
                    <p className="text-gray-400 text-sm">{item.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedStock(item)}
                      className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-full"
                    >
                      <FaChartLine />
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(item.symbol)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Change</span>
                    <span className={item.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {item.percentChange >= 0 ? '+' : ''}{item.percentChange.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Added</span>
                    <span className="text-gray-400">
                      {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStock && (
        <StockDetailModal
          stock={{
            symbol: selectedStock.symbol,
            name: selectedStock.name,
            price: selectedStock.price,
            change: selectedStock.change,
            percentChange: selectedStock.percentChange,
            marketCap: 0, // These values will be fetched in the modal
            volume: 0,
            sector: '',
            high: 0,
            low: 0,
            open: 0,
            previousClose: 0
          }}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
} 