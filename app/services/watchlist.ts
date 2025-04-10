interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  addedAt: number;
}

class WatchlistService {
  private static instance: WatchlistService;
  private watchlist: WatchlistItem[] = [];
  private listeners: ((items: WatchlistItem[]) => void)[] = [];

  private constructor() {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      this.watchlist = JSON.parse(savedWatchlist);
    }
  }

  public static getInstance(): WatchlistService {
    if (!WatchlistService.instance) {
      WatchlistService.instance = new WatchlistService();
    }
    return WatchlistService.instance;
  }

  public addItem(item: WatchlistItem): void {
    if (!this.watchlist.find(i => i.symbol === item.symbol)) {
      this.watchlist.push(item);
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  public removeItem(symbol: string): void {
    this.watchlist = this.watchlist.filter(item => item.symbol !== symbol);
    this.saveToStorage();
    this.notifyListeners();
  }

  public updateItem(symbol: string, updates: Partial<WatchlistItem>): void {
    this.watchlist = this.watchlist.map(item => {
      if (item.symbol === symbol) {
        return { ...item, ...updates };
      }
      return item;
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  public getItems(): WatchlistItem[] {
    return [...this.watchlist];
  }

  public isWatched(symbol: string): boolean {
    return this.watchlist.some(item => item.symbol === symbol);
  }

  public addListener(listener: (items: WatchlistItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getItems()));
  }

  private saveToStorage(): void {
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
  }
}

export const watchlistService = WatchlistService.getInstance(); 