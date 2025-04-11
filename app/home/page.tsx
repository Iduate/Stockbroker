'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MarketDataService } from '../services/marketData';
import Link from 'next/link';
import { FaHistory, FaUser, FaShoppingCart, FaBell, FaSearch, FaNewspaper, FaChartPie } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import TradeModal from '../components/TradeModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
  Filler
} from 'chart.js';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartJSTooltip,
  ChartJSLegend,
  Filler
);

// Type declarations
interface StockData {
  symbol: string;
  description: string;
  price: number;
  change: number;
}

interface PortfolioData {
  holdings: Array<{
    symbol: string;
    shares: number;
    averagePrice: number;
    currentPrice: number;
  }>;
  totalValue: number;
}

interface EconomicData {
  name: string;
  value: number;
  change: number;
}

interface MarketData {
  symbol: string;
  name?: string;  // Making name optional to match the data structure
  price: number;
  change: number;
  percentChange: number;
}

interface Portfolio {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  percentChange: number;
}

interface AssetAllocation {
  type: string;
  percentage: number;
  value: number;
  color: string;
}

interface MarketMover {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  marketCap: number;
}

interface SectorPerformance {
  sector: string;
  change: number;
  marketCap: number;
  volume: number;
  trending: 'up' | 'down';
}

interface ChartData {
  labels: string[];
  values: number[];
}

interface SearchResult {
  symbol: string;
  description: string;
  name?: string;
}

const accountTypes = {
  retirement: 'Retirement and IRAs',
  health: 'Health Saving',
  inheritance: 'Inheritance Account',
  brokerage: 'Brokerage Account',
  college: 'College Savings Plans',
};

interface UserInfo {
  firstName: string;
  lastName: string;
  accountOwnership: string;
  isNewUser: boolean;
}

// Mock data for charts
const stockData = [
  { name: '9:30 AM', SPY: 4200, AAPL: 150, MSFT: 280, GOOGL: 2800 },
  { name: '10:30 AM', SPY: 4220, AAPL: 152, MSFT: 282, GOOGL: 2830 },
  { name: '11:30 AM', SPY: 4180, AAPL: 149, MSFT: 279, GOOGL: 2790 },
  { name: '12:30 PM', SPY: 4250, AAPL: 153, MSFT: 285, GOOGL: 2850 },
  { name: '1:30 PM', SPY: 4230, AAPL: 151, MSFT: 283, GOOGL: 2820 },
  { name: '2:30 PM', SPY: 4280, AAPL: 155, MSFT: 288, GOOGL: 2880 },
  { name: '3:30 PM', SPY: 4300, AAPL: 156, MSFT: 290, GOOGL: 2900 },
];

// Updated portfolio data without crypto
const portfolioData = [
  { name: 'US Stocks', value: 55 },
  { name: 'International Stocks', value: 25 },
  { name: 'Bonds', value: 15 },
  { name: 'Cash', value: 5 }
];

const watchlist = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150.23, change: +2.5 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 285.45, change: -1.2 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2830.79, change: +1.8 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3250.50, change: +0.9 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 750.25, change: -2.1 },
];

const recentTransactions = [
  { id: 1, type: 'BUY', symbol: 'AAPL', shares: 10, price: 150.23, total: 1502.30, date: '2024-03-20' },
  { id: 2, type: 'SELL', symbol: 'MSFT', shares: 5, price: 285.45, total: 1427.25, date: '2024-03-19' },
  { id: 3, type: 'BUY', symbol: 'GOOGL', shares: 2, price: 2830.79, total: 5661.58, date: '2024-03-18' },
];

// Add more stocks to the watchlist data
const extendedWatchlist = [
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 180.75, change: 7.25, percentChange: 4.18 },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 172.82, change: -8.93, percentChange: -4.91 },
  { symbol: 'META', name: 'Meta Platforms Inc', price: 505.95, change: 18.45, percentChange: 3.78 },
  { symbol: 'NFLX', name: 'Netflix Inc', price: 628.45, change: 12.75, percentChange: 2.07 },
  { symbol: 'DIS', name: 'Walt Disney Co', price: 121.84, change: -0.95, percentChange: -0.77 },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc', price: 62.84, change: -1.25, percentChange: -1.95 },
  { symbol: 'INTC', name: 'Intel Corp', price: 42.75, change: 0.85, percentChange: 2.03 },
  { symbol: 'CRM', name: 'Salesforce Inc', price: 295.45, change: 5.75, percentChange: 1.98 },
  { symbol: 'V', name: 'Visa Inc', price: 278.90, change: 3.45, percentChange: 1.25 },
  { symbol: 'WMT', name: 'Walmart Inc', price: 162.34, change: 1.15, percentChange: 0.71 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co', price: 195.24, change: 2.34, percentChange: 1.21 },
  { symbol: 'BAC', name: 'Bank of America Corp', price: 35.67, change: -0.45, percentChange: -1.25 },
  { symbol: 'PFE', name: 'Pfizer Inc', price: 27.45, change: -0.65, percentChange: -2.31 },
  { symbol: 'KO', name: 'Coca-Cola Co', price: 59.87, change: 0.34, percentChange: 0.57 },
  { symbol: 'CSCO', name: 'Cisco Systems Inc', price: 49.23, change: 0.87, percentChange: 1.80 }
];

// Add market news articles
const marketNews = [
  {
    id: '1',
    title: 'Fed Signals Rate Cut Timeline',
    content: 'Federal Reserve officials indicate potential rate cuts later this year as inflation shows signs of cooling.',
    source: 'Financial Times',
    timestamp: '2 hours ago',
    category: 'Economy'
  },
  {
    id: '2',
    title: 'Tech Sector Rally Continues',
    content: 'Technology stocks extend gains as AI boom drives investor optimism.',
    source: 'Reuters',
    timestamp: '3 hours ago',
    category: 'Technology'
  },
  {
    id: '3',
    title: 'Oil Prices Surge on Supply Concerns',
    content: 'Crude oil prices rise 3% amid geopolitical tensions affecting global supply chains.',
    source: 'Bloomberg',
    timestamp: '4 hours ago',
    category: 'Commodities'
  }
];

// Add sector performance data
const sectorData = [
  { name: 'Technology', value: 35 },
  { name: 'Healthcare', value: 20 },
  { name: 'Financials', value: 15 },
  { name: 'Consumer', value: 12 },
  { name: 'Energy', value: 10 },
  { name: 'Others', value: 8 }
];

// Updated asset allocation without crypto
const assetAllocation = [
  { type: 'US Large Cap', percentage: 35, value: 3745723.45, color: 'bg-blue-500' },
  { type: 'US Mid Cap', percentage: 15, value: 1605309.58, color: 'bg-green-500' },
  { type: 'US Small Cap', percentage: 10, value: 1070206.39, color: 'bg-yellow-500' },
  { type: 'International Developed', percentage: 20, value: 2140412.78, color: 'bg-purple-500' },
  { type: 'Emerging Markets', percentage: 10, value: 1070206.39, color: 'bg-red-500' },
  { type: 'Bonds', percentage: 7, value: 749144.47, color: 'bg-indigo-500' },
  { type: 'Cash', percentage: 3, value: 321061.92, color: 'bg-gray-500' }
];

// Add economic indicators
const economicIndicators = [
  { name: 'US 10Y Treasury', value: '4.85%', change: '+0.03', trend: 'up' },
  { name: 'US 30Y Treasury', value: '4.97%', change: '+0.02', trend: 'up' },
  { name: 'Federal Funds Rate', value: '5.25-5.50%', change: '0.00', trend: 'neutral' },
  { name: 'US CPI YoY', value: '3.2%', change: '-0.1', trend: 'down' },
  { name: 'US GDP Growth', value: '2.1%', change: '+0.2', trend: 'up' },
  { name: 'US Unemployment', value: '3.8%', change: '-0.1', trend: 'down' }
];

// Add global market indices
const globalIndices = [
  { name: 'FTSE 100', value: 7683.45, change: 45.23, percentChange: 0.59 },
  { name: 'DAX', value: 16920.73, change: 123.45, percentChange: 0.73 },
  { name: 'Nikkei 225', value: 39910.35, change: 567.89, percentChange: 1.44 },
  { name: 'Shanghai Composite', value: 3075.67, change: -12.34, percentChange: -0.40 }
];

// Add commodities data
const commodities = [
  { name: 'Crude Oil', price: 81.25, change: 1.45, percentChange: 1.82 },
  { name: 'Gold', price: 2238.50, change: 15.30, percentChange: 0.69 },
  { name: 'Silver', price: 25.12, change: 0.45, percentChange: 1.82 },
  { name: 'Natural Gas', price: 1.85, change: -0.05, percentChange: -2.63 }
];

// Add more market news
const additionalMarketNews = [
  {
    id: '4',
    title: 'Semiconductor Stocks Surge on AI Demand',
    content: 'Leading chip manufacturers report strong earnings as artificial intelligence applications drive unprecedented demand.',
    source: 'Wall Street Journal',
    timestamp: '30 minutes ago',
    category: 'Technology'
  },
  {
    id: '5',
    title: 'Treasury Yields Hit New Highs',
    content: '10-year Treasury yield reaches 4.85% as investors reassess Federal Reserve\'s rate path.',
    source: 'Bloomberg',
    timestamp: '45 minutes ago',
    category: 'Bonds'
  },
  {
    id: '6',
    title: 'Manufacturing PMI Shows Expansion',
    content: 'US manufacturing sector returns to growth territory for the first time in 18 months.',
    source: 'Reuters',
    timestamp: '1 hour ago',
    category: 'Economy'
  }
];

// Add sector performance with more detail
const enhancedSectorData = [
  { name: 'Technology', value: 35, ytdReturn: 15.8, peRatio: 28.5, dividend: 1.2 },
  { name: 'Healthcare', value: 20, ytdReturn: 8.2, peRatio: 22.3, dividend: 2.1 },
  { name: 'Financials', value: 15, ytdReturn: 6.5, peRatio: 15.8, dividend: 3.4 },
  { name: 'Industrials', value: 12, ytdReturn: 9.3, peRatio: 19.2, dividend: 2.3 },
  { name: 'Consumer Staples', value: 10, ytdReturn: 4.2, peRatio: 20.1, dividend: 2.8 },
  { name: 'Energy', value: 8, ytdReturn: 11.5, peRatio: 12.4, dividend: 4.2 }
];

// Get the singleton instance
const marketDataService = MarketDataService.getInstance();

// Add a declaration for @heroicons/react/outline
declare module '@heroicons/react/outline' {
  export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<MarketData | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist'>('portfolio');
  const [isOfferLoading, setIsOfferLoading] = useState(false);

  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([
    { name: 'S&P 500', value: 5248.49, change: 35.12, percentChange: 0.67 },
    { name: 'Dow Jones', value: 39412.75, change: 267.23, percentChange: 0.68 },
    { name: 'NASDAQ', value: 16379.45, change: 98.45, percentChange: 0.60 },
    { name: 'Russell 2000', value: 2092.34, change: -12.45, percentChange: -0.59 }
  ]);

  const [topMovers, setTopMovers] = useState<MarketMover[]>([
    {
      symbol: 'NVDA',
      companyName: 'NVIDIA Corporation',
      price: 942.89,
      change: 45.67,
      percentChange: 5.09,
      volume: 52845621,
      marketCap: 2330000000000
    },
    {
      symbol: 'META',
      companyName: 'Meta Platforms Inc.',
      price: 505.95,
      change: 18.45,
      percentChange: 3.78,
      volume: 23456789,
      marketCap: 1290000000000
    },
    {
      symbol: 'TSLA',
      companyName: 'Tesla, Inc.',
      price: 172.82,
      change: -8.93,
      percentChange: -4.91,
      volume: 34567890,
      marketCap: 548000000000
    }
  ]);

  const [portfolio, setPortfolio] = useState<Portfolio[]>([
    {
      symbol: 'AAPL',
      quantity: 150,
      avgPrice: 175.50,
      currentPrice: 180.25,
      totalValue: 27037.50,
      dayChange: 712.50,
      dayChangePercent: 2.71
    },
    {
      symbol: 'MSFT',
      quantity: 100,
      avgPrice: 420.75,
      currentPrice: 428.50,
      totalValue: 42850.00,
      dayChange: 775.00,
      dayChangePercent: 1.84
    },
    {
      symbol: 'GOOGL',
      quantity: 80,
      avgPrice: 152.30,
      currentPrice: 155.75,
      totalValue: 12460.00,
      dayChange: 276.00,
      dayChangePercent: 2.27
    },
    {
      symbol: 'AMZN',
      quantity: 120,
      avgPrice: 178.45,
      currentPrice: 182.90,
      totalValue: 21948.00,
      dayChange: 534.00,
      dayChangePercent: 2.49
    },
    {
      symbol: 'NVDA',
      quantity: 50,
      avgPrice: 890.25,
      currentPrice: 942.89,
      totalValue: 47144.50,
      dayChange: 2283.50,
      dayChangePercent: 5.09
    },
    {
      symbol: 'AMD',
      quantity: 200,
      avgPrice: 170.25,
      currentPrice: 180.75,
      totalValue: 36150.00,
      dayChange: 2100.00,
      dayChangePercent: 6.17
    },
    {
      symbol: 'TSLA',
      quantity: 150,
      avgPrice: 165.50,
      currentPrice: 172.82,
      totalValue: 25923.00,
      dayChange: -1339.50,
      dayChangePercent: -4.91
    },
    {
      symbol: 'META',
      quantity: 75,
      avgPrice: 485.30,
      currentPrice: 505.95,
      totalValue: 37946.25,
      dayChange: 1548.75,
      dayChangePercent: 4.26
    },
    {
      symbol: 'NFLX',
      quantity: 60,
      avgPrice: 610.25,
      currentPrice: 628.45,
      totalValue: 37707.00,
      dayChange: 1092.00,
      dayChangePercent: 2.98
    },
    {
      symbol: 'JPM',
      quantity: 100,
      avgPrice: 182.50,
      currentPrice: 189.75,
      totalValue: 18975.00,
      dayChange: 725.00,
      dayChangePercent: 3.97
    }
  ]);

  const [watchlist, setWatchlist] = useState<MarketData[]>([
    {
      symbol: 'AMD',
      price: 180.75,
      change: 7.25,
      percentChange: 4.18
    },
    {
      symbol: 'TSLA',
      price: 172.82,
      change: -8.93,
      percentChange: -4.91
    },
    {
      symbol: 'META',
      price: 505.95,
      change: 18.45,
      percentChange: 3.78
    },
    {
      symbol: 'NFLX',
      price: 628.45,
      change: 12.75,
      percentChange: 2.07
    },
    {
      symbol: 'DIS',
      price: 121.84,
      change: -0.95,
      percentChange: -0.77
    },
    {
      symbol: 'PYPL',
      price: 62.84,
      change: -1.25,
      percentChange: -1.95
    },
    {
      symbol: 'INTC',
      price: 42.75,
      change: 0.85,
      percentChange: 2.03
    },
    {
      symbol: 'CRM',
      price: 295.45,
      change: 5.75,
      percentChange: 1.98
    },
    {
      symbol: 'V',
      price: 278.90,
      change: 3.45,
      percentChange: 1.25
    },
    {
      symbol: 'WMT',
      price: 162.34,
      change: 1.15,
      percentChange: 0.71
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      symbol: 'AAPL',
      quantity: 10,
      price: 175.50,
      total: 1755.00,
      date: '2024-03-27T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'sell',
      symbol: 'GOOGL',
      quantity: 2,
      price: 2850.75,
      total: 5701.50,
      date: '2024-03-27T09:15:00Z',
      status: 'completed'
    }
  ]);

  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'NVIDIA Surges on AI Chip Demand',
      source: 'MarketWatch',
      time: '15 minutes ago',
      impact: 'positive',
      description: 'NVIDIA shares hit new all-time high as demand for AI chips continues to outpace supply. Company announces new manufacturing partnerships.'
    },
    {
      id: '2',
      title: 'Federal Reserve Signals Potential Rate Cuts',
      source: 'Financial Times',
      time: '1 hour ago',
      impact: 'positive',
      description: 'Fed Chair suggests multiple rate cuts possible in 2024 as inflation continues to moderate.'
    },
    {
      id: '3',
      title: 'Tesla Shares Drop on Production Concerns',
      source: 'Reuters',
      time: '2 hours ago',
      impact: 'negative',
      description: 'Tesla stock falls as analysts express concern over production delays and increasing competition in the EV market.'
    },
    {
      id: '4',
      title: 'Apple Unveils Next-Gen AI Features',
      source: 'TechCrunch',
      time: '3 hours ago',
      impact: 'positive',
      description: 'Apple announces major AI updates coming to iPhone and iPad, showcasing new generative AI capabilities.'
    },
    {
      id: '5',
      title: 'Oil Prices Surge Amid Middle East Tensions',
      source: 'Bloomberg',
      time: '4 hours ago',
      impact: 'negative',
      description: 'Crude oil prices jump 3% as geopolitical tensions raise supply concerns.'
    }
  ]);

  const [tradeForm, setTradeForm] = useState({
    type: 'buy',
    symbol: '',
    quantity: '',
    price: '',
  });

  const [sectorPerformance, setSectorPerformance] = useState<SectorPerformance[]>([
    {
      sector: 'Technology',
      change: 2.45,
      marketCap: 12500000000000,
      volume: 15200000000,
      trending: 'up'
    },
    {
      sector: 'Healthcare',
      change: -0.85,
      marketCap: 5200000000000,
      volume: 8500000000,
      trending: 'down'
    },
    {
      sector: 'Financial',
      change: 1.75,
      marketCap: 7800000000000,
      volume: 9200000000,
      trending: 'up'
    },
    {
      sector: 'Consumer Cyclical',
      change: -0.35,
      marketCap: 4200000000000,
      volume: 6800000000,
      trending: 'down'
    },
    {
      sector: 'Energy',
      change: 3.25,
      marketCap: 3500000000000,
      volume: 5400000000,
      trending: 'up'
    }
  ]);

  const [portfolioHistory, setPortfolioHistory] = useState<ChartData>({
    labels: ['1D', '2D', '3D', '4D', '5D', '1W', '2W', '1M', '3M', '6M', '1Y'],
    values: [10679722, 10582450, 10498200, 10725400, 10680500, 10550200, 10325400, 9850200, 9250400, 8725600, 8125400]
  });

  const [volumeHistory, setVolumeHistory] = useState<ChartData>({
    labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
    values: [2500000, 1800000, 2200000, 1500000, 1900000, 1200000, 1600000, 2100000, 1700000, 2300000, 2800000, 2000000, 2400000, 3100000]
  });

  useEffect(() => {
    // Initialize user info from localStorage if available
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, watchlistRes] = await Promise.all([
          fetch('/api/portfolio'),
          fetch('/api/watchlist')
        ]);

        if (portfolioRes.ok) {
          const data = await portfolioRes.json();
          setPortfolio(data.portfolio);
        }

        if (watchlistRes.ok) {
          const data = await watchlistRes.json();
          setWatchlist(data.watchlist);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribeFunctions: (() => void)[] = [];

    // Subscribe to real-time updates for portfolio stocks
    portfolio.forEach(item => {
      const unsubscribe = marketDataService.subscribe((data) => {
        if (data.symbol === item.symbol) {
          setPortfolio(prev => prev.map(p => 
            p.symbol === data.symbol
              ? {
                  ...p,
                  currentPrice: data.price,
                  totalValue: p.quantity * data.price,
                  dayChange: data.change * p.quantity,
                  dayChangePercent: data.changePercent
                }
              : p
          ));
        }
      });
      unsubscribeFunctions.push(unsubscribe);
    });

    // Subscribe to real-time updates for watchlist
    watchlist.forEach(item => {
      const unsubscribe = marketDataService.subscribe((data) => {
        if (data.symbol === item.symbol) {
          setWatchlist(prev => prev.map(w => 
            w.symbol === data.symbol
              ? {
                  symbol: data.symbol,
                  price: data.price,
                  change: data.change,
                  percentChange: data.changePercent
                }
              : w
          ));
        }
      });
      unsubscribeFunctions.push(unsubscribe);
    });

    return () => {
      // Cleanup subscriptions
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [portfolio, watchlist]);

  const handleSymbolSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const responseData: unknown = await response.json();
      
      if (Array.isArray(responseData) && responseData.every(item => 
        typeof item === 'object' && 
        item !== null &&
        'symbol' in item && 
        'description' in item
      )) {
        setSearchResults(responseData as SearchResult[]);
      setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching symbols:', error);
    }
  };

  const handleSymbolSelect = async (symbol: string) => {
    try {
      const data = await marketDataService.getStockData(symbol);
      setTradeForm(prev => ({ ...prev, symbol, price: data.price.toString() }));
      setShowSearchResults(false);
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const handleTrade = async (tradeData: {
    type: 'buy' | 'sell';
    symbol: string;
    quantity: number;
    price: number;
  }) => {
    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tradeData,
          accountId: selectedAccount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Close modal
      setShowTradeModal(false);

      // Refresh portfolio data
      const portfolioResponse = await fetch('/api/portfolio');
      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json();
        setPortfolio(portfolioData.portfolio);
      }

      // Add the transaction to the list
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: tradeData.type,
        symbol: tradeData.symbol,
        quantity: tradeData.quantity,
        price: tradeData.price,
        total: tradeData.quantity * tradeData.price,
        date: new Date().toISOString(),
        status: 'completed'
      };

      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Trading error:', error);
      alert(error instanceof Error ? error.message : 'Failed to process trade');
    }
  };

  const totalPortfolioValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0);
  const totalDayChange = portfolio.reduce((sum, item) => sum + item.dayChange, 0);
  const totalDayChangePercent = (totalDayChange / (totalPortfolioValue - totalDayChange)) * 100;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Chart configurations
  const portfolioChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    }
  };

  const portfolioChartData = {
    labels: portfolioHistory.labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: portfolioHistory.values,
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const volumeChartData = {
    labels: volumeHistory.labels,
    datasets: [
      {
        label: 'Trading Volume',
        data: volumeHistory.values,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  };

  // Prefetch the offer page
  useEffect(() => {
    router.prefetch('/offer');
  }, [router]);

  const handleOfferClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOfferLoading(true);
    await router.push('/offer');
    setIsOfferLoading(false);
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Show welcome message only once when user first arrives
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      localStorage.setItem('hasSeenWelcome', 'true');
      toast.success(`Welcome, ${user.firstName}! Your account has been created successfully.`);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const getWelcomeMessage = () => {
    if (!userInfo) return null;

    const currentHour = new Date().getHours();
    let greeting = 'Welcome';

    if (currentHour < 12) {
      greeting = 'Good morning';
    } else if (currentHour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

      return (
        <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {greeting}, {userInfo.firstName} {userInfo.lastName}!
          </h1>
        <p className="text-xl text-blue-200/80">
          {userInfo.isNewUser 
            ? "Welcome to your new trading account! Let's get started."
            : "Here's your trading dashboard. Ready to make some moves?"}
          </p>
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Header */}
        <div className="flex justify-between items-center py-4 mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/offer" className="text-white hover:text-blue-400 transition-colors">
              <FaShoppingCart className="w-6 h-6" />
            </Link>
            <Link href="/profile" className="text-white hover:text-blue-400 transition-colors">
              <FaUser className="w-6 h-6" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-blue-400 transition-colors">
              <FaBell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {getWelcomeMessage()}

        {/* Economic Indicators */}
        <div className="bg-[#132F4C] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Economic Indicators</h2>
          <div className="grid grid-cols-6 gap-4">
            {economicIndicators.map((indicator) => (
              <div key={indicator.name} className="bg-white/5 rounded-lg p-4">
                <h4 className="text-gray-400 text-sm mb-2">{indicator.name}</h4>
                <div className="text-xl font-semibold text-white">{indicator.value}</div>
                <div className={`text-sm ${
                  indicator.trend === 'up' ? 'text-green-400' :
                  indicator.trend === 'down' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {indicator.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Markets */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Global Markets</h3>
            <div className="grid grid-cols-2 gap-4">
              {globalIndices.map((index) => (
                <div key={index.name} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white">{index.name}</h4>
                    <span className={`text-sm ${index.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {index.percentChange >= 0 ? '+' : ''}{index.percentChange}%
                    </span>
                  </div>
                  <div className="text-2xl font-semibold text-white mt-2">{index.value.toLocaleString()}</div>
                  <div className={`text-sm ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {index.change >= 0 ? '+' : ''}{index.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commodities */}
          <div className="col-span-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Commodities</h3>
            <div className="space-y-4">
              {commodities.map((commodity) => (
                <div key={commodity.name} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white">{commodity.name}</h4>
                    <span className={`text-sm ${commodity.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {commodity.percentChange >= 0 ? '+' : ''}{commodity.percentChange}%
                    </span>
                  </div>
                  <div className="text-xl font-semibold text-white mt-2">${commodity.price}</div>
                  <div className={`text-sm ${commodity.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {commodity.change >= 0 ? '+' : ''}{commodity.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Chart */}
          <div className="col-span-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Market Overview</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1929',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="SPY" stroke="#8884d8" />
                  <Line type="monotone" dataKey="AAPL" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="MSFT" stroke="#ffc658" />
                  <Line type="monotone" dataKey="GOOGL" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Distribution */}
          <div className="col-span-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Portfolio Distribution</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1929',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Watchlist */}
          <div className="col-span-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Watchlist</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="pb-3 text-left">Symbol</th>
                    <th className="pb-3 text-left">Name</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((stock) => (
                    <tr key={stock.symbol} className="border-b border-white/10">
                      <td className="py-3 text-white font-medium">{stock.symbol}</td>
                      <td className="py-3 text-gray-300">{stock.name}</td>
                      <td className="py-3 text-right text-white">${stock.price.toFixed(2)}</td>
                      <td className={`py-3 text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="col-span-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="pb-3 text-left">Type</th>
                    <th className="pb-3 text-left">Symbol</th>
                    <th className="pb-3 text-right">Shares</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-white/10">
                      <td className={`py-3 font-medium ${transaction.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type}
                      </td>
                      <td className="py-3 text-white">{transaction.symbol}</td>
                      <td className="py-3 text-right text-gray-300">{transaction.shares}</td>
                      <td className="py-3 text-right text-gray-300">${transaction.price.toFixed(2)}</td>
                      <td className="py-3 text-right text-white">${transaction.total.toFixed(2)}</td>
                      <td className="py-3 text-right text-gray-300">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* New Market News Section */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Market News</h3>
              <FaNewspaper className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {marketNews.map(article => (
                <div key={article.id} className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-medium text-white mb-2">{article.title}</h4>
                  <p className="text-gray-300 mb-2">{article.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{article.source}</span>
                    <span>{article.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Distribution */}
          <div className="col-span-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Sector Distribution</h3>
              <FaChartPie className="text-gray-400" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1929',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trading Volume Chart */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Trading Volume</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeHistory.values.map((value, index) => ({
                  time: volumeHistory.labels[index],
                  volume: value
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="time" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1929',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="volume" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Extended Watchlist */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Extended Watchlist</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="pb-3 text-left">Symbol</th>
                    <th className="pb-3 text-left">Name</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-right">Change</th>
                    <th className="pb-3 text-right">% Change</th>
                  </tr>
                </thead>
                <tbody>
                  {extendedWatchlist.map((stock) => (
                    <tr key={stock.symbol} className="border-b border-white/10">
                      <td className="py-3 text-white font-medium">{stock.symbol}</td>
                      <td className="py-3 text-gray-300">{stock.name}</td>
                      <td className="py-3 text-right text-white">${stock.price.toFixed(2)}</td>
                      <td className={`py-3 text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </td>
                      <td className={`py-3 text-right ${stock.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enhanced Sector Performance */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Sector Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="pb-3 text-left">Sector</th>
                    <th className="pb-3 text-right">Weight (%)</th>
                    <th className="pb-3 text-right">YTD Return (%)</th>
                    <th className="pb-3 text-right">P/E Ratio</th>
                    <th className="pb-3 text-right">Dividend Yield (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {enhancedSectorData.map((sector) => (
                    <tr key={sector.name} className="border-b border-white/10">
                      <td className="py-3 text-white">{sector.name}</td>
                      <td className="py-3 text-right text-gray-300">{sector.value}</td>
                      <td className={`py-3 text-right ${sector.ytdReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {sector.ytdReturn >= 0 ? '+' : ''}{sector.ytdReturn}
                      </td>
                      <td className="py-3 text-right text-gray-300">{sector.peRatio}</td>
                      <td className="py-3 text-right text-gray-300">{sector.dividend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Combined Market News */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Market News & Analysis</h3>
            <div className="grid grid-cols-2 gap-6">
              {[...marketNews, ...additionalMarketNews].map((article) => (
                <div key={article.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-400">{article.category}</span>
                    <span className="text-sm text-gray-400">{article.timestamp}</span>
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">{article.title}</h4>
                  <p className="text-gray-300 mb-2">{article.content}</p>
                  <div className="text-sm text-gray-400">{article.source}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TradeModal
        isOpen={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        onSubmit={handleTrade}
      />
    </div>
  );
} 