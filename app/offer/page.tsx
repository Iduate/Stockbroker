'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { FaSearch, FaStar, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { BuyDialog } from '../components/BuyDialog';
import SearchBar from '../components/SearchBar';
import SectorSelector from '../components/SectorSelector';
import StocksTable from '../components/StocksTable';
import { type Stock, type SectorType } from '../types';
import { toast } from 'react-hot-toast';

// Define available sectors
const SECTORS: SectorType[] = [
  'Technology',
  'Finance',
  'Healthcare',
  'Consumer',
  'Industrial',
  'Energy',
  'Materials',
  'Utilities',
  'Real Estate',
  'Communication'
];

// Initial stock symbols with global stocks
const initialStocks: Record<SectorType, Stock[]> = {
  Technology: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.37, change: 2.15, sector: 'Technology', minimumPrice: 100, changePercent: 1.15, marketCap: 2.95e12, volume: 65000000, peRatio: 29.5, dividendYield: 0.5, beta: 1.2, lastUpdated: '2024-03-20' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420.72, change: 1.45, sector: 'Technology', minimumPrice: 200, changePercent: 0.34, marketCap: 3.12e12, volume: 25000000, peRatio: 35.8, dividendYield: 0.7, beta: 0.9, lastUpdated: '2024-03-20' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 153.58, change: -0.82, sector: 'Technology', minimumPrice: 100, changePercent: -0.53, marketCap: 1.95e12, volume: 30000000, peRatio: 24.3, dividendYield: 0.0, beta: 1.1, lastUpdated: '2024-03-20' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 177.58, change: 1.23, sector: 'Technology', minimumPrice: 100, changePercent: 0.69, marketCap: 1.84e12, volume: 45000000, peRatio: 60.2, dividendYield: 0.0, beta: 1.3, lastUpdated: '2024-03-20' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 950.02, change: 3.45, sector: 'Technology', minimumPrice: 400, changePercent: 0.36, marketCap: 2.35e12, volume: 50000000, peRatio: 75.4, dividendYield: 0.0, beta: 1.8, lastUpdated: '2024-03-20' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.58, change: 2.67, sector: 'Technology', minimumPrice: 200, changePercent: 0.55, marketCap: 1.25e12, volume: 18000000, peRatio: 32.7, dividendYield: 0.0, beta: 1.4, lastUpdated: '2024-03-20' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.34, change: -1.23, sector: 'Technology', minimumPrice: 100, changePercent: -0.70, marketCap: 550e9, volume: 120000000, peRatio: 42.5, dividendYield: 0.0, beta: 2.0, lastUpdated: '2024-03-20' },
    { symbol: 'INTC', name: 'Intel Corporation', price: 42.66, change: 0.45, sector: 'Technology', minimumPrice: 20, changePercent: 1.06, marketCap: 180e9, volume: 45000000, peRatio: 110.5, dividendYield: 1.2, beta: 0.8, lastUpdated: '2024-03-20' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 178.29, change: 1.89, sector: 'Technology', minimumPrice: 80, changePercent: 1.07, marketCap: 290e9, volume: 60000000, peRatio: 350.2, dividendYield: 0.0, beta: 1.7, lastUpdated: '2024-03-20' },
    { symbol: 'CRM', name: 'Salesforce Inc.', price: 300.45, change: -0.67, sector: 'Technology', minimumPrice: 150, changePercent: -0.22, marketCap: 290e9, volume: 5000000, peRatio: 45.8, dividendYield: 0.0, beta: 1.3, lastUpdated: '2024-03-20' },
    { symbol: 'ADBE', name: 'Adobe Inc.', price: 560.34, change: 1.23, sector: 'Technology', minimumPrice: 250, changePercent: 0.22, marketCap: 150e9, volume: 10000000, peRatio: 35.8, dividendYield: 0.0, beta: 1.4, lastUpdated: '2024-03-20' },
    { symbol: 'ORCL', name: 'Oracle Corporation', price: 125.67, change: 0.89, sector: 'Technology', minimumPrice: 60, changePercent: 0.71, marketCap: 180e9, volume: 20000000, peRatio: 15.8, dividendYield: 0.0, beta: 0.9, lastUpdated: '2024-03-20' },
    { symbol: 'IBM', name: 'International Business Machines', price: 190.45, change: -0.45, sector: 'Technology', minimumPrice: 90, changePercent: -0.24, marketCap: 120e9, volume: 10000000, peRatio: 10.5, dividendYield: 3.7, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'QCOM', name: 'Qualcomm Inc.', price: 170.34, change: 1.67, sector: 'Technology', minimumPrice: 80, changePercent: 0.98, marketCap: 130e9, volume: 10000000, peRatio: 15.8, dividendYield: 0.0, beta: 1.0, lastUpdated: '2024-03-20' },
    { symbol: 'TXN', name: 'Texas Instruments Inc.', price: 175.45, change: 0.34, sector: 'Technology', minimumPrice: 80, changePercent: 0.19, marketCap: 120e9, volume: 10000000, peRatio: 15.8, dividendYield: 1.2, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'AVGO', name: 'Broadcom Inc.', price: 1350.23, change: 2.45, sector: 'Technology', minimumPrice: 600, changePercent: 0.18, marketCap: 120e9, volume: 10000000, peRatio: 15.8, dividendYield: 0.0, beta: 1.0, lastUpdated: '2024-03-20' },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.', price: 52.34, change: 0.67, sector: 'Technology', minimumPrice: 25, changePercent: 1.28, marketCap: 150e9, volume: 20000000, peRatio: 15.8, dividendYield: 0.0, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'INTU', name: 'Intuit Inc.', price: 620.45, change: 1.89, sector: 'Technology', minimumPrice: 300, changePercent: 0.30, marketCap: 120e9, volume: 1000000, peRatio: 25.8, dividendYield: 0.0, beta: 0.4, lastUpdated: '2024-03-20' },
    { symbol: 'ADP', name: 'Automatic Data Processing', price: 245.67, change: 0.45, sector: 'Technology', minimumPrice: 120, changePercent: 0.18, marketCap: 120e9, volume: 1000000, peRatio: 15.8, dividendYield: 0.0, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'NOW', name: 'ServiceNow Inc.', price: 780.34, change: 2.34, sector: 'Technology', minimumPrice: 350, changePercent: 0.30, marketCap: 120e9, volume: 1000000, peRatio: 25.8, dividendYield: 0.0, beta: 0.4, lastUpdated: '2024-03-20' }
  ],
  Finance: [
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 195.45, change: 1.23, sector: 'Finance', minimumPrice: 100, changePercent: 0.63, marketCap: 450e9, volume: 15000000, peRatio: 12.5, dividendYield: 2.3, beta: 1.1, lastUpdated: '2024-03-20' },
    { symbol: 'BAC', name: 'Bank of America Corp.', price: 35.67, change: 0.45, sector: 'Finance', minimumPrice: 15, changePercent: 1.27, marketCap: 280e9, volume: 40000000, peRatio: 11.8, dividendYield: 2.8, beta: 1.4, lastUpdated: '2024-03-20' },
    { symbol: 'WFC', name: 'Wells Fargo & Co.', price: 58.34, change: 0.67, sector: 'Finance', minimumPrice: 25, changePercent: 1.16, marketCap: 210e9, volume: 25000000, peRatio: 12.1, dividendYield: 2.5, beta: 1.2, lastUpdated: '2024-03-20' },
    { symbol: 'GS', name: 'The Goldman Sachs Group Inc.', price: 420.56, change: 2.34, sector: 'Finance', minimumPrice: 200, changePercent: 0.56, marketCap: 150e9, volume: 2000000, peRatio: 17.8, dividendYield: 2.1, beta: 1.3, lastUpdated: '2024-03-20' },
    { symbol: 'MS', name: 'Morgan Stanley', price: 95.67, change: 0.89, sector: 'Finance', minimumPrice: 45, changePercent: 0.94, marketCap: 160e9, volume: 8000000, peRatio: 15.2, dividendYield: 3.2, beta: 1.5, lastUpdated: '2024-03-20' },
    { symbol: 'BLK', name: 'BlackRock Inc.', price: 850.34, change: 3.45, sector: 'Finance', minimumPrice: 400, changePercent: 0.41, marketCap: 120e9, volume: 500000, peRatio: 20.5, dividendYield: 2.4, beta: 1.1, lastUpdated: '2024-03-20' },
    { symbol: 'SCHW', name: 'Charles Schwab Corp.', price: 75.45, change: -0.67, sector: 'Finance', minimumPrice: 35, changePercent: -0.88, marketCap: 140e9, volume: 7000000, peRatio: 18.3, dividendYield: 1.8, beta: 1.2, lastUpdated: '2024-03-20' },
    { symbol: 'AXP', name: 'American Express Co.', price: 220.67, change: 1.23, sector: 'Finance', minimumPrice: 100, changePercent: 0.56, marketCap: 160e9, volume: 3000000, peRatio: 19.8, dividendYield: 1.2, beta: 1.4, lastUpdated: '2024-03-20' },
    { symbol: 'V', name: 'Visa Inc.', price: 280.34, change: 2.45, sector: 'Finance', minimumPrice: 140, changePercent: 0.88, marketCap: 550e9, volume: 6000000, peRatio: 32.5, dividendYield: 0.7, beta: 0.9, lastUpdated: '2024-03-20' },
    { symbol: 'MA', name: 'Mastercard Inc.', price: 450.67, change: 3.67, sector: 'Finance', minimumPrice: 200, changePercent: 0.82, marketCap: 400e9, volume: 4000000, peRatio: 35.8, dividendYield: 0.5, beta: 1.0, lastUpdated: '2024-03-20' },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc.', price: 65.34, change: -1.23, sector: 'Finance', minimumPrice: 30, changePercent: -1.85, marketCap: 70e9, volume: 15000000, peRatio: 15.2, dividendYield: 0.0, beta: 1.6, lastUpdated: '2024-03-20' },
    { symbol: 'COF', name: 'Capital One Financial Corp.', price: 145.67, change: 0.89, sector: 'Finance', minimumPrice: 70, changePercent: 0.61, marketCap: 55e9, volume: 3000000, peRatio: 9.8, dividendYield: 1.8, beta: 1.3, lastUpdated: '2024-03-20' },
    { symbol: 'USB', name: 'U.S. Bancorp', price: 45.34, change: 0.45, sector: 'Finance', minimumPrice: 20, changePercent: 1.00, marketCap: 65e9, volume: 5000000, peRatio: 11.2, dividendYield: 4.2, beta: 1.1, lastUpdated: '2024-03-20' },
    { symbol: 'PNC', name: 'PNC Financial Services Group', price: 155.67, change: 0.67, sector: 'Finance', minimumPrice: 75, changePercent: 0.43, marketCap: 60e9, volume: 2000000, peRatio: 12.5, dividendYield: 3.8, beta: 1.2, lastUpdated: '2024-03-20' },
    { symbol: 'TFC', name: 'Truist Financial Corp.', price: 38.45, change: 0.23, sector: 'Finance', minimumPrice: 15, changePercent: 0.60, marketCap: 50e9, volume: 4000000, peRatio: 10.8, dividendYield: 5.2, beta: 1.4, lastUpdated: '2024-03-20' },
    { symbol: 'BK', name: 'The Bank of New York Mellon Corp.', price: 55.34, change: 0.45, sector: 'Finance', minimumPrice: 25, changePercent: 0.82, marketCap: 45e9, volume: 3000000, peRatio: 13.2, dividendYield: 3.2, beta: 1.1, lastUpdated: '2024-03-20' },
    { symbol: 'STT', name: 'State Street Corp.', price: 75.67, change: 0.34, sector: 'Finance', minimumPrice: 35, changePercent: 0.45, marketCap: 25e9, volume: 2000000, peRatio: 11.8, dividendYield: 3.5, beta: 1.3, lastUpdated: '2024-03-20' },
    { symbol: 'DFS', name: 'Discover Financial Services', price: 125.34, change: 0.67, sector: 'Finance', minimumPrice: 60, changePercent: 0.54, marketCap: 30e9, volume: 2000000, peRatio: 8.5, dividendYield: 2.1, beta: 1.5, lastUpdated: '2024-03-20' },
    { symbol: 'SYF', name: 'Synchrony Financial', price: 45.67, change: 0.23, sector: 'Finance', minimumPrice: 20, changePercent: 0.51, marketCap: 20e9, volume: 3000000, peRatio: 7.8, dividendYield: 2.8, beta: 1.6, lastUpdated: '2024-03-20' },
    { symbol: 'ALLY', name: 'Ally Financial Inc.', price: 38.45, change: 0.34, sector: 'Finance', minimumPrice: 15, changePercent: 0.89, marketCap: 12e9, volume: 2000000, peRatio: 9.2, dividendYield: 3.1, beta: 1.4, lastUpdated: '2024-03-20' }
  ],
  Healthcare: [
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 155.67, change: 0.89, sector: 'Healthcare', minimumPrice: 75, changePercent: 0.57, marketCap: 380e9, volume: 6000000, peRatio: 15.8, dividendYield: 3.0, beta: 0.6, lastUpdated: '2024-03-20' },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 520.34, change: 2.45, sector: 'Healthcare', minimumPrice: 250, changePercent: 0.47, marketCap: 480e9, volume: 3000000, peRatio: 20.5, dividendYield: 1.4, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.45, change: -0.23, sector: 'Healthcare', minimumPrice: 10, changePercent: -0.80, marketCap: 160e9, volume: 25000000, peRatio: 75.2, dividendYield: 5.8, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'ABBV', name: 'AbbVie Inc.', price: 180.67, change: 1.23, sector: 'Healthcare', minimumPrice: 90, changePercent: 0.69, marketCap: 320e9, volume: 5000000, peRatio: 35.8, dividendYield: 3.8, beta: 0.8, lastUpdated: '2024-03-20' },
    { symbol: 'MRK', name: 'Merck & Co. Inc.', price: 125.34, change: 0.67, sector: 'Healthcare', minimumPrice: 60, changePercent: 0.54, marketCap: 320e9, volume: 8000000, peRatio: 15.2, dividendYield: 2.4, beta: 0.5, lastUpdated: '2024-03-20' },
    { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', price: 580.45, change: 3.45, sector: 'Healthcare', minimumPrice: 250, changePercent: 0.60, marketCap: 220e9, volume: 1000000, peRatio: 35.8, dividendYield: 0.0, beta: 0.9, lastUpdated: '2024-03-20' },
    { symbol: 'ABT', name: 'Abbott Laboratories', price: 120.67, change: 0.89, sector: 'Healthcare', minimumPrice: 60, changePercent: 0.74, marketCap: 210e9, volume: 5000000, peRatio: 35.8, dividendYield: 1.8, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'DHR', name: 'Danaher Corp.', price: 250.34, change: 1.67, sector: 'Healthcare', minimumPrice: 120, changePercent: 0.67, marketCap: 190e9, volume: 2000000, peRatio: 30.5, dividendYield: 0.4, beta: 0.8, lastUpdated: '2024-03-20' },
    { symbol: 'BMY', name: 'Bristol-Myers Squibb Co.', price: 52.45, change: 0.34, sector: 'Healthcare', minimumPrice: 25, changePercent: 0.65, marketCap: 110e9, volume: 8000000, peRatio: 12.8, dividendYield: 4.8, beta: 0.6, lastUpdated: '2024-03-20' },
    { symbol: 'AMGN', name: 'Amgen Inc.', price: 280.67, change: 1.89, sector: 'Healthcare', minimumPrice: 140, changePercent: 0.68, marketCap: 150e9, volume: 2000000, peRatio: 14.5, dividendYield: 3.2, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'GILD', name: 'Gilead Sciences Inc.', price: 75.34, change: 0.45, sector: 'Healthcare', minimumPrice: 35, changePercent: 0.60, marketCap: 95e9, volume: 5000000, peRatio: 15.8, dividendYield: 3.8, beta: 0.8, lastUpdated: '2024-03-20' },
    { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Inc.', price: 420.45, change: 2.67, sector: 'Healthcare', minimumPrice: 200, changePercent: 0.64, marketCap: 110e9, volume: 1000000, peRatio: 25.8, dividendYield: 0.0, beta: 0.6, lastUpdated: '2024-03-20' },
    { symbol: 'REGN', name: 'Regeneron Pharmaceuticals Inc.', price: 950.67, change: 5.67, sector: 'Healthcare', minimumPrice: 400, changePercent: 0.60, marketCap: 105e9, volume: 500000, peRatio: 20.5, dividendYield: 0.0, beta: 0.7, lastUpdated: '2024-03-20' },
    { symbol: 'MRNA', name: 'Moderna Inc.', price: 120.34, change: -1.23, sector: 'Healthcare', minimumPrice: 60, changePercent: -1.01, marketCap: 45e9, volume: 5000000, peRatio: 0.0, dividendYield: 0.0, beta: 1.8, lastUpdated: '2024-03-20' },
    { symbol: 'BIIB', name: 'Biogen Inc.', price: 240.45, change: 1.45, sector: 'Healthcare', minimumPrice: 120, changePercent: 0.61, marketCap: 35e9, volume: 1000000, peRatio: 25.8, dividendYield: 0.0, beta: 0.9, lastUpdated: '2024-03-20' },
    { symbol: 'ILMN', name: 'Illumina Inc.', price: 140.67, change: 0.89, sector: 'Healthcare', minimumPrice: 70, changePercent: 0.64, marketCap: 22e9, volume: 1000000, peRatio: 0.0, dividendYield: 0.0, beta: 1.2, lastUpdated: '2024-03-20' },
    { symbol: 'IQV', name: 'IQVIA Holdings Inc.', price: 240.34, change: 1.67, sector: 'Healthcare', minimumPrice: 120, changePercent: 0.70, marketCap: 45e9, volume: 800000, peRatio: 30.5, dividendYield: 0.0, beta: 1.1, lastUpdated: '2024-03-20' },
    { symbol: 'ZTS', name: 'Zoetis Inc.', price: 180.45, change: 1.23, sector: 'Healthcare', minimumPrice: 90, changePercent: 0.68, marketCap: 85e9, volume: 1500000, peRatio: 35.8, dividendYield: 0.8, beta: 0.8, lastUpdated: '2024-03-20' },
    { symbol: 'HCA', name: 'HCA Healthcare Inc.', price: 320.67, change: 2.45, sector: 'Healthcare', minimumPrice: 160, changePercent: 0.77, marketCap: 90e9, volume: 1000000, peRatio: 15.8, dividendYield: 0.8, beta: 1.3, lastUpdated: '2024-03-20' },
    { symbol: 'CVS', name: 'CVS Health Corp.', price: 75.34, change: 0.45, sector: 'Healthcare', minimumPrice: 35, changePercent: 0.60, marketCap: 95e9, volume: 7000000, peRatio: 12.5, dividendYield: 3.5, beta: 0.7, lastUpdated: '2024-03-20' }
  ],
  Consumer: [],
  Industrial: [],
  Energy: [],
  Materials: [],
  Utilities: [],
  'Real Estate': [],
  Communication: []
};

export default function OfferPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedSector, setSelectedSector] = useState<SectorType>('Technology');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Stock; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    loadStocks();
  }, [isAuthenticated, router]);

  const loadStocks = async () => {
    try {
      const response = await fetch('/api/stocks', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load stocks');
      }

      const data = await response.json();
      setStocks(data.stocks || []);
    } catch (error) {
      console.error('Error loading stocks:', error);
      toast.error('Failed to load stocks');
    }
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setIsBuyDialogOpen(true);
  };

  const handleBuy = async (quantity: number) => {
    if (!selectedStock) return;

    try {
      const response = await fetch('/api/trading/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      toast.success('Order placed successfully');
      setIsBuyDialogOpen(false);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const handleSort = (key: keyof Stock) => {
    setSortConfig(prev => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' };
      }
      return {
        key,
        direction: prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0A1929] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Stock Market</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <SectorSelector
              sectors={SECTORS}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
            />
          </div>

          <div className="md:col-span-3">
            <SearchBar onSearch={(query) => console.log('Search:', query)} />
            
            <StocksTable
              stocks={stocks}
              onStockSelect={handleStockSelect}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </div>
        </div>
          </div>

      {isBuyDialogOpen && selectedStock && (
          <BuyDialog
            stock={selectedStock}
          onClose={() => setIsBuyDialogOpen(false)}
          onBuy={handleBuy}
        />
      )}
    </div>
  );
}