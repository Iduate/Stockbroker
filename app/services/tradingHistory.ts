interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

class TradingHistoryService {
  private static instance: TradingHistoryService;
  private trades: Trade[] = [];
  private listeners: ((trades: Trade[]) => void)[] = [];

  private constructor() {
    // Load trading history from localStorage
    const savedTrades = localStorage.getItem('tradingHistory');
    if (savedTrades) {
      this.trades = JSON.parse(savedTrades);
    }
  }

  public static getInstance(): TradingHistoryService {
    if (!TradingHistoryService.instance) {
      TradingHistoryService.instance = new TradingHistoryService();
    }
    return TradingHistoryService.instance;
  }

  public addTrade(trade: Omit<Trade, 'id' | 'timestamp'>): void {
    const newTrade: Trade = {
      ...trade,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    this.trades.unshift(newTrade);
    this.saveToStorage();
    this.notifyListeners();
  }

  public getTrades(): Trade[] {
    return [...this.trades];
  }

  public getTradesBySymbol(symbol: string): Trade[] {
    return this.trades.filter(trade => trade.symbol === symbol);
  }

  public getTradesByDateRange(startDate: number, endDate: number): Trade[] {
    return this.trades.filter(trade => 
      trade.timestamp >= startDate && trade.timestamp <= endDate
    );
  }

  public getTradesByType(type: 'buy' | 'sell'): Trade[] {
    return this.trades.filter(trade => trade.type === type);
  }

  public updateTradeStatus(id: string, status: Trade['status']): void {
    this.trades = this.trades.map(trade => {
      if (trade.id === id) {
        return { ...trade, status };
      }
      return trade;
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  public getTradeSummary(): {
    totalTrades: number;
    buyTrades: number;
    sellTrades: number;
    totalVolume: number;
    totalValue: number;
  } {
    return {
      totalTrades: this.trades.length,
      buyTrades: this.trades.filter(t => t.type === 'buy').length,
      sellTrades: this.trades.filter(t => t.type === 'sell').length,
      totalVolume: this.trades.reduce((sum, t) => sum + t.shares, 0),
      totalValue: this.trades.reduce((sum, t) => sum + t.total, 0),
    };
  }

  public addListener(listener: (trades: Trade[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getTrades()));
  }

  private saveToStorage(): void {
    localStorage.setItem('tradingHistory', JSON.stringify(this.trades));
  }
}

export const tradingHistoryService = TradingHistoryService.getInstance(); 