import { toast } from 'react-hot-toast';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY';
const FINNHUB_WEBSOCKET_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private constructor() {
    this.connect();
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private connect() {
    try {
      this.ws = new WebSocket(FINNHUB_WEBSOCKET_URL);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        
        // Subscribe to default symbols
        const defaultSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
        defaultSymbols.forEach(symbol => this.subscribe(symbol));
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'trade') {
          this.notifySubscribers('trade', data.data);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket Disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        toast.error('Error connecting to market data');
      };
    } catch (error) {
      console.error('WebSocket Connection Error:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      toast.error('Failed to connect to market data after multiple attempts');
    }
  }

  subscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    }
  }

  unsubscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }

  addSubscriber(event: string, callback: (data: any) => void) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)?.add(callback);
  }

  removeSubscriber(event: string, callback: (data: any) => void) {
    this.subscribers.get(event)?.delete(callback);
  }

  private notifySubscribers(event: string, data: any) {
    this.subscribers.get(event)?.forEach(callback => callback(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
} 