import { stockAPI } from './api';
import { toast } from 'react-hot-toast';

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'above' | 'below' | 'equals';
  isActive: boolean;
  createdAt: number;
  triggeredAt?: number;
}

interface StockQuote {
  symbol: string;
  c: number; // current price
}

class PriceAlertService {
  private static instance: PriceAlertService;
  private alerts: PriceAlert[] = [];
  private listeners: ((alerts: PriceAlert[]) => void)[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Load alerts from localStorage
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
      this.alerts = JSON.parse(savedAlerts);
    }
    this.startChecking();
  }

  public static getInstance(): PriceAlertService {
    if (!PriceAlertService.instance) {
      PriceAlertService.instance = new PriceAlertService();
    }
    return PriceAlertService.instance;
  }

  public addAlert(symbol: string, name: string, targetPrice: number, condition: PriceAlert['condition']): void {
    const newAlert: PriceAlert = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      name,
      targetPrice,
      condition,
      isActive: true,
      createdAt: Date.now()
    };

    this.alerts.push(newAlert);
    this.saveToStorage();
    this.notifyListeners();
  }

  public removeAlert(id: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  public updateAlert(id: string, updates: Partial<PriceAlert>): void {
    this.alerts = this.alerts.map(alert => {
      if (alert.id === id) {
        return { ...alert, ...updates };
      }
      return alert;
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  public getAlerts(): PriceAlert[] {
    return [...this.alerts];
  }

  public getActiveAlerts(): PriceAlert[] {
    return this.alerts.filter(alert => alert.isActive);
  }

  public getAlertsBySymbol(symbol: string): PriceAlert[] {
    return this.alerts.filter(alert => alert.symbol === symbol);
  }

  public addListener(listener: (alerts: PriceAlert[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private async checkPrices(): Promise<void> {
    const activeAlerts = this.getActiveAlerts();
    if (activeAlerts.length === 0) return;

    const symbols = [...new Set(activeAlerts.map(alert => alert.symbol))];
    
    try {
      const quotes = await Promise.all(
        symbols.map(symbol => stockAPI.getQuote(symbol))
      );

      for (const alert of activeAlerts) {
        const quote = quotes.find((q: StockQuote) => q.symbol === alert.symbol);
        if (!quote) continue;

        const currentPrice = quote.c;
        let isTriggered = false;

        switch (alert.condition) {
          case 'above':
            isTriggered = currentPrice >= alert.targetPrice;
            break;
          case 'below':
            isTriggered = currentPrice <= alert.targetPrice;
            break;
          case 'equals':
            isTriggered = Math.abs(currentPrice - alert.targetPrice) < 0.01;
            break;
        }

        if (isTriggered) {
          this.updateAlert(alert.id, {
            isActive: false,
            triggeredAt: Date.now()
          });
          toast.success(`Price alert triggered for ${alert.symbol}: ${alert.condition} $${alert.targetPrice}`);
        }
      }
    } catch (error) {
      console.error('Error checking price alerts:', error);
    }
  }

  private startChecking(): void {
    // Check prices every minute
    this.checkInterval = setInterval(() => this.checkPrices(), 60000);
  }

  private stopChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getAlerts()));
  }

  private saveToStorage(): void {
    localStorage.setItem('priceAlerts', JSON.stringify(this.alerts));
  }
}

export const priceAlertService = PriceAlertService.getInstance(); 