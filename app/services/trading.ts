import axios from 'axios';
import { toast } from 'react-hot-toast';

// You would replace these with your actual trading API endpoints
const TRADING_API_BASE_URL = process.env.NEXT_PUBLIC_TRADING_API_URL || 'https://api.yourbroker.com';
const TRADING_API_KEY = process.env.TRADING_API_KEY;

export interface TradeRequest {
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  accountId: string;
}

export interface TradeResponse {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  message?: string;
  executedPrice?: number;
  commission?: number;
  timestamp: string;
}

class TradingService {
  private static instance: TradingService;
  private api: typeof axios;

  private constructor() {
    this.api = axios.create({
      baseURL: TRADING_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TRADING_API_KEY}`,
      },
    });
  }

  public static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  }

  public async executeTrade(tradeRequest: TradeRequest): Promise<TradeResponse> {
    try {
      // Validate the trade request
      this.validateTradeRequest(tradeRequest);

      // Get current market price to ensure it hasn't moved significantly
      const currentPrice = await this.getCurrentPrice(tradeRequest.symbol);
      
      // Check if price hasn't moved more than 1% from requested price
      const priceDiff = Math.abs(currentPrice - tradeRequest.price) / tradeRequest.price;
      if (priceDiff > 0.01) {
        throw new Error('Price has moved significantly. Please refresh and try again.');
      }

      // Execute the trade
      const response = await this.api.post<TradeResponse>('/trades', tradeRequest);
      
      // Handle the response
      if (response.data.status === 'COMPLETED') {
        toast.success(`Trade executed successfully at $${response.data.executedPrice}`);
      } else if (response.data.status === 'PENDING') {
        toast.info('Trade order placed and pending execution');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute trade';
      toast.error(errorMessage);
      throw error;
    }
  }

  public async getAccountBalance(accountId: string): Promise<number> {
    try {
      const response = await this.api.get(`/accounts/${accountId}/balance`);
      return response.data.balance;
    } catch (error) {
      console.error('Failed to get account balance:', error);
      throw error;
    }
  }

  public async getOpenOrders(accountId: string): Promise<TradeResponse[]> {
    try {
      const response = await this.api.get(`/accounts/${accountId}/orders`);
      return response.data;
    } catch (error) {
      console.error('Failed to get open orders:', error);
      throw error;
    }
  }

  private validateTradeRequest(request: TradeRequest): void {
    if (!request.symbol) throw new Error('Symbol is required');
    if (!request.quantity || request.quantity <= 0) throw new Error('Quantity must be greater than 0');
    if (!request.price || request.price <= 0) throw new Error('Price must be greater than 0');
    if (!request.accountId) throw new Error('Account ID is required');
    if (!['BUY', 'SELL'].includes(request.type)) throw new Error('Invalid trade type');
  }

  private async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await this.api.get(`/quotes/${symbol}`);
      return response.data.price;
    } catch (error) {
      console.error('Failed to get current price:', error);
      throw error;
    }
  }
}

export const tradingService = TradingService.getInstance(); 