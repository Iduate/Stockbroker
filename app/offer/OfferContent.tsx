'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSearch, FaFilter, FaStar, FaChartLine } from 'react-icons/fa';
import { WebSocketService } from '../services/websocket';
import { stockAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import StockDetailModal from '../components/StockDetailModal';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  marketCap: number;
  volume: number;
  sector: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

const sectors = [
  'Technology',
  'Healthcare',
  'Financial',
  'Consumer Cyclical',
  'Energy',
  'Industrial',
  'Communication',
  'Materials',
  'Real Estate',
  'Utilities'
];

// Initial stock symbols to track
const initialSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'BAC', 'WMT'];

export default function OfferContent() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stock;
    direction: 'asc' | 'desc';
  }>({ key: 'marketCap', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  useEffect(() => {
    const ws = WebSocketService.getInstance();
    const fetchInitialData = async () => {
      try {
        const stocksData = await Promise.all(
          initialSymbols.map(async (symbol) => {
            const [quote, profile] = await Promise.all([
              stockAPI.getQuote(symbol),
              stockAPI.getCompanyProfile(symbol)
            ]);

            return {
              symbol,
              name: profile.name,
              price: quote.c,
              change: quote.d,
              percentChange: quote.dp,
              marketCap: profile.marketCapitalization,
              volume: 0, // Will be updated by WebSocket
              sector: profile.finnhubIndustry,
              high: quote.h,
              low: quote.l,
              open: quote.o,
              previousClose: quote.pc
            };
          })
        );

        setStocks(stocksData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching initial stock data:', error);
        toast.error('Failed to load stock data');
      }
    };

    const handleTradeData = (data: any) => {
      setStocks(prevStocks => {
        return prevStocks.map(stock => {
          if (stock.symbol === data.s) {
            return {
              ...stock,
              price: data.p,
              volume: data.v,
              change: data.p - stock.previousClose,
              percentChange: ((data.p - stock.previousClose) / stock.previousClose) * 100
            };
          }
          return stock;
        });
      });
    };

    fetchInitialData();
    ws.addSubscriber('trade', handleTradeData);

    return () => {
      ws.removeSubscriber('trade', handleTradeData);
    };
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) return;

    try {
      const searchResults = await stockAPI.searchSymbols(query);
      const newSymbols = searchResults.result
        .slice(0, 5)
        .map((result: any) => result.symbol)
        .filter((symbol: string) => !stocks.find(s => s.symbol === symbol));

      if (newSymbols.length > 0) {
        const ws = WebSocketService.getInstance();
        newSymbols.forEach(symbol => ws.subscribe(symbol));

        const newStocksData = await Promise.all(
          newSymbols.map(async (symbol) => {
            const [quote, profile] = await Promise.all([
              stockAPI.getQuote(symbol),
              stockAPI.getCompanyProfile(symbol)
            ]);

            return {
              symbol,
              name: profile.name,
              price: quote.c,
              change: quote.d,
              percentChange: quote.dp,
              marketCap: profile.marketCapitalization,
              volume: 0,
              sector: profile.finnhubIndustry,
              high: quote.h,
              low: quote.l,
              open: quote.o,
              previousClose: quote.pc
            };
          })
        );

        setStocks(prev => [...prev, ...newStocksData]);
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
      toast.error('Failed to search stocks');
    }
  };

  const handleSectorFilter = (sector: string) => {
    const newSelectedSectors = selectedSectors.includes(sector)
      ? selectedSectors.filter(s => s !== sector)
      : [...selectedSectors, sector];
    
    setSelectedSectors(newSelectedSectors);
  };

  const handleSort = (key: keyof Stock) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    
    const sortedStocks = [...stocks].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    
    setStocks(sortedStocks);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000) {
      return `$${(marketCap).toFixed(2)}B`;
    }
    return `$${(marketCap * 1000).toFixed(2)}M`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toString();
  };

  const filteredStocks = stocks.filter(stock =>
    (selectedSectors.length === 0 || selectedSectors.includes(stock.sector)) &&
    (searchQuery === '' || 
     stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <div className="text-white">Loading stock data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Stock Offerings</h1>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by symbol or company name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Sectors</h2>
            <div className="flex flex-wrap gap-2">
              {sectors.map(sector => (
                <button
                  key={sector}
                  onClick={() => handleSectorFilter(sector)}
                  className={`px-3 py-1 rounded-full border ${
                    selectedSectors.includes(sector)
                      ? 'bg-blue-500 border-blue-600 text-white'
                      : 'border-white/20 hover:border-blue-500/50 text-gray-300'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stocks Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="pb-4 text-left">Symbol</th>
                <th className="pb-4 text-left">Name</th>
                <th className="pb-4 text-right cursor-pointer" onClick={() => handleSort('price')}>
                  Price
                </th>
                <th className="pb-4 text-right cursor-pointer" onClick={() => handleSort('percentChange')}>
                  Change
                </th>
                <th className="pb-4 text-right cursor-pointer" onClick={() => handleSort('marketCap')}>
                  Market Cap
                </th>
                <th className="pb-4 text-right cursor-pointer" onClick={() => handleSort('volume')}>
                  Volume
                </th>
                <th className="pb-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.symbol} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-4 text-white font-medium">{stock.symbol}</td>
                  <td className="py-4 text-gray-300">{stock.name}</td>
                  <td className="py-4 text-right text-white">${stock.price.toFixed(2)}</td>
                  <td className={`py-4 text-right ${stock.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                  </td>
                  <td className="py-4 text-right text-gray-300">{formatMarketCap(stock.marketCap)}</td>
                  <td className="py-4 text-right text-gray-300">{formatVolume(stock.volume)}</td>
                  <td className="py-4">
                    <div className="flex justify-center space-x-2">
                      <button className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-full">
                        <FaStar />
                      </button>
                      <button 
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-full"
                        onClick={() => setSelectedStock(stock)}
                      >
                        <FaChartLine />
                      </button>
                      <button 
                        className="px-3 py-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg"
                        onClick={() => setSelectedStock(stock)}
                      >
                        Trade
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
} 