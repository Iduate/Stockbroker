interface PortfolioItem {
  symbol: string;
  name: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  lastUpdated: number;
}

class PortfolioService {
  private static instance: PortfolioService;
  private portfolio: PortfolioItem[] = [];
  private listeners: ((items: PortfolioItem[]) => void)[] = [];

  private constructor() {
    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      this.portfolio = JSON.parse(savedPortfolio);
    }
  }

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  public addPosition(symbol: string, name: string, shares: number, price: number): void {
    const existingPosition = this.portfolio.find(item => item.symbol === symbol);
    
    if (existingPosition) {
      // Update existing position
      const newShares = existingPosition.shares + shares;
      const newTotalCost = (existingPosition.shares * existingPosition.averagePrice) + (shares * price);
      const newAveragePrice = newTotalCost / newShares;

      this.updatePosition(symbol, {
        shares: newShares,
        averagePrice: newAveragePrice,
        currentPrice: price,
        totalValue: newShares * price,
        profitLoss: (price - newAveragePrice) * newShares,
        profitLossPercentage: ((price - newAveragePrice) / newAveragePrice) * 100,
        lastUpdated: Date.now()
      });
    } else {
      // Add new position
      this.portfolio.push({
        symbol,
        name,
        shares,
        averagePrice: price,
        currentPrice: price,
        totalValue: shares * price,
        profitLoss: 0,
        profitLossPercentage: 0,
        lastUpdated: Date.now()
      });
    }

    this.saveToStorage();
    this.notifyListeners();
  }

  public removePosition(symbol: string): void {
    this.portfolio = this.portfolio.filter(item => item.symbol !== symbol);
    this.saveToStorage();
    this.notifyListeners();
  }

  public updatePosition(symbol: string, updates: Partial<PortfolioItem>): void {
    this.portfolio = this.portfolio.map(item => {
      if (item.symbol === symbol) {
        return { ...item, ...updates };
      }
      return item;
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  public getPosition(symbol: string): PortfolioItem | undefined {
    return this.portfolio.find(item => item.symbol === symbol);
  }

  public getPortfolio(): PortfolioItem[] {
    return [...this.portfolio];
  }

  public getPortfolioSummary(): {
    totalValue: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
    numberOfPositions: number;
  } {
    const totalValue = this.portfolio.reduce((sum, item) => sum + item.totalValue, 0);
    const totalCost = this.portfolio.reduce((sum, item) => sum + (item.shares * item.averagePrice), 0);
    const totalProfitLoss = totalValue - totalCost;
    const totalProfitLossPercentage = (totalProfitLoss / totalCost) * 100;

    return {
      totalValue,
      totalProfitLoss,
      totalProfitLossPercentage,
      numberOfPositions: this.portfolio.length
    };
  }

  public addListener(listener: (items: PortfolioItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getPortfolio()));
  }

  private saveToStorage(): void {
    localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
  }
}

export const portfolioService = PortfolioService.getInstance(); 