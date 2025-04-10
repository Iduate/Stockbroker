import axios from 'axios';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // This will send cookies with the request
});

// Add response interceptor to handle errors and caching
api.interceptors.response.use(
  (response) => {
    // Cache successful GET requests
    if (response.config.method?.toLowerCase() === 'get') {
      const cacheKey = `${response.config.method}-${response.config.url}-${JSON.stringify(response.config.params)}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      redirect('/signin');
    }
    return Promise.reject(error);
  }
);

// Helper function to get cached data
const getCachedData = (method: string, url: string, params?: any) => {
  const cacheKey = `${method}-${url}-${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  return null;
};

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/user/password', data),
  updateNotifications: (data: any) => api.put('/user/notifications', data),
};

export const accountService = {
  getAccounts: () => api.get('/accounts'),
  createAccount: (data: any) => api.post('/accounts', data),
  deleteAccount: (accountId: string) => api.delete(`/accounts/${accountId}`),
};

export const transactionService = {
  getTransactions: (params?: any) => api.get('/transactions', { params }),
  getTransactionById: (id: string) => api.get(`/transactions/${id}`),
};

export const offerService = {
  getOffers: async () => {
    const cached = getCachedData('get', '/offers');
    if (cached) {
      return { data: cached };
    }
    return api.get('/offers');
  },
  getActiveOffers: async () => {
    const cached = getCachedData('get', '/offers/active');
    if (cached) {
      return { data: cached };
    }
    return api.get('/offers/active');
  },
  activateOffer: (offerId: string) => {
    // Clear cache when activating an offer
    cache.clear();
    return api.post(`/offers/${offerId}/activate`);
  },
  processPayment: (paymentData: {
    stockSymbol: string;
    quantity: number;
    amount: number;
  }) => api.post('/api/payments/process', paymentData),
};

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

if (!ALPHA_VANTAGE_API_KEY) {
  console.warn('ALPHA_VANTAGE_API_KEY is not set in environment variables');
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
}

export interface CompanyProfile {
  name: string;
  symbol: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  exchange: string;
  marketCap: number;
  description: string;
  dividendYield: number;
  peRatio: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

export interface StockCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AlphaVantageResponse {
  [key: string]: any;
}

class StockAPI {
  private async fetchFromAlphaVantage(params: Record<string, string>): Promise<AlphaVantageResponse> {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('Alpha Vantage API key is not configured');
    }

    const queryParams = new URLSearchParams({
      ...params,
      apikey: ALPHA_VANTAGE_API_KEY,
    });

    const response = await fetch(`${ALPHA_VANTAGE_BASE_URL}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.statusText}`);
    }

    const data = await response.json() as AlphaVantageResponse;
    
    // Check for API error messages
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      console.warn('Alpha Vantage API note:', data['Note']);
    }

    return data;
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    const data = await this.fetchFromAlphaVantage({
      function: 'GLOBAL_QUOTE',
      symbol,
    });

    const quote = data['Global Quote'] as Record<string, string>;
    if (!quote) {
      throw new Error(`No data available for symbol: ${symbol}`);
    }

    return {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
      volume: parseInt(quote['06. volume']),
    };
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const data = await this.fetchFromAlphaVantage({
      function: 'OVERVIEW',
      symbol,
    }) as Record<string, string>;

    return {
      name: data['Name'],
      symbol: data['Symbol'],
      sector: data['Sector'],
      industry: data['Industry'],
      country: data['Country'],
      currency: data['Currency'],
      exchange: data['Exchange'],
      marketCap: parseFloat(data['MarketCapitalization']),
      description: data['Description'],
      dividendYield: parseFloat(data['DividendYield']),
      peRatio: parseFloat(data['PERatio']),
      beta: parseFloat(data['Beta']),
      fiftyTwoWeekHigh: parseFloat(data['52WeekHigh']),
      fiftyTwoWeekLow: parseFloat(data['52WeekLow']),
    };
  }

  async getCandles(symbol: string, interval: string = '1min', outputSize: string = 'compact'): Promise<StockCandle[]> {
    const data = await this.fetchFromAlphaVantage({
      function: 'TIME_SERIES_INTRADAY',
      symbol,
      interval,
      outputsize: outputSize,
    });

    const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
    if (!timeSeriesKey) {
      throw new Error('No time series data found');
    }

    const timeSeries = data[timeSeriesKey] as Record<string, Record<string, string>>;
    return Object.entries(timeSeries).map(([timestamp, values]) => ({
      timestamp,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));
  }

  async searchSymbols(query: string) {
    const data = await this.fetchFromAlphaVantage({
      function: 'SYMBOL_SEARCH',
      keywords: query,
    });

    const matches = (data.bestMatches || []) as Array<Record<string, string>>;
    return matches.map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      marketOpen: match['5. marketOpen'],
      marketClose: match['6. marketClose'],
      timezone: match['7. timezone'],
      currency: match['8. currency'],
      matchScore: match['9. matchScore'],
    }));
  }

  async getMarketNews(category: string = 'general') {
    return this.fetchFromAlphaVantage({
      function: 'NEWS_SENTIMENT',
      topics: category,
    });
  }

  async getCompanyNews(symbol: string) {
    return this.fetchFromAlphaVantage({
      function: 'NEWS_SENTIMENT',
      tickers: symbol,
    });
  }

  async getBasicFinancials(symbol: string) {
    return this.fetchFromAlphaVantage({
      function: 'OVERVIEW',
      symbol,
    });
  }

  async getPeers(symbol: string) {
    return this.fetchFromAlphaVantage({
      function: 'OVERVIEW',
      symbol,
    });
  }

  async getEarnings(symbol: string) {
    return this.fetchFromAlphaVantage({
      function: 'EARNINGS',
      symbol,
    });
  }

  async getRecommendations(symbol: string) {
    return this.fetchFromAlphaVantage({
      function: 'OVERVIEW',
      symbol,
    });
  }
}

export const stockAPI = new StockAPI();

export default api; 