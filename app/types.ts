export type SectorType = 
  | 'Technology'
  | 'Finance'
  | 'Healthcare'
  | 'Consumer'
  | 'Industrial'
  | 'Energy'
  | 'Materials'
  | 'Utilities'
  | 'Real Estate'
  | 'Communication';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  sector: SectorType;
  minimumPrice: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  peRatio: number;
  dividendYield: number;
  beta: number;
  lastUpdated: string;
} 