import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaChartLine, FaHistory, FaNewspaper, FaUsers, FaStar } from 'react-icons/fa';
import { stockAPI } from '../services/api';
import { watchlistService } from '../services/watchlist';
import { tradingHistoryService } from '../services/tradingHistory';
import { toast } from 'react-hot-toast';
import StockChart from './StockChart';
import { priceAlertService } from '../services/priceAlerts';
import { portfolioService } from '../services/portfolio';

interface StockDetailModalProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percentChange: number;
    marketCap: number;
    volume: number;
    sector: string;
    high: number;
    low: number;
    open: number;
    previousClose: number;
  };
  onClose: () => void;
}

interface TradeForm {
  type: 'buy' | 'sell';
  shares: number;
  price: number;
}

export default function StockDetailModal({ stock, onClose }: StockDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'history' | 'news'>('overview');
  const [tradeForm, setTradeForm] = useState<TradeForm>({
    type: 'buy',
    shares: 1,
    price: stock.price
  });
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [peers, setPeers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatched, setIsWatched] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [portfolioPosition, setPortfolioPosition] = useState<any>(null);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertForm, setAlertForm] = useState({
    targetPrice: stock.price,
    condition: 'above' as 'above' | 'below' | 'equals'
  });
  const chartContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    setIsWatched(watchlistService.isWatched(stock.symbol));
    setTrades(tradingHistoryService.getTradesBySymbol(stock.symbol));
    setAlerts(priceAlertService.getAlertsBySymbol(stock.symbol));
    setPortfolioPosition(portfolioService.getPosition(stock.symbol));

    const unsubscribe = tradingHistoryService.addListener((updatedTrades) => {
      setTrades(updatedTrades.filter(t => t.symbol === stock.symbol));
    });

    const unsubscribeAlerts = priceAlertService.addListener((updatedAlerts) => {
      setAlerts(updatedAlerts.filter(a => a.symbol === stock.symbol));
    });

    const unsubscribePortfolio = portfolioService.addListener((updatedPortfolio) => {
      setPortfolioPosition(updatedPortfolio.find(p => p.symbol === stock.symbol));
    });

    return () => {
      unsubscribe();
      unsubscribeAlerts();
      unsubscribePortfolio();
    };
  }, [stock.symbol]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [basicFinancials, companyNews, stockPeers] = await Promise.all([
          stockAPI.getBasicFinancials(stock.symbol),
          stockAPI.getCompanyNews(stock.symbol, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), new Date().toISOString()),
          stockAPI.getPeers(stock.symbol)
        ]);

        setFinancials(basicFinancials);
        setNews(companyNews);
        setPeers(stockPeers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stock details:', error);
        toast.error('Failed to load stock details');
      }
    };

    fetchData();
  }, [stock.symbol]);

  const handleTrade = async () => {
    try {
      const total = tradeForm.shares * tradeForm.price;
      
      // Add trade to history
      tradingHistoryService.addTrade({
        symbol: stock.symbol,
        type: tradeForm.type,
        shares: tradeForm.shares,
        price: tradeForm.price,
        total,
        status: 'completed'
      });

      // Update portfolio
      if (tradeForm.type === 'buy') {
        portfolioService.addPosition(stock.symbol, stock.name, tradeForm.shares, tradeForm.price);
      } else {
        const position = portfolioService.getPosition(stock.symbol);
        if (position && position.shares >= tradeForm.shares) {
          portfolioService.removePosition(stock.symbol);
        }
      }

      toast.success(`Trade executed: ${tradeForm.type.toUpperCase()} ${tradeForm.shares} shares of ${stock.symbol} at $${tradeForm.price.toFixed(2)}`);
      onClose();
    } catch (error) {
      console.error('Error executing trade:', error);
      toast.error('Failed to execute trade');
    }
  };

  const toggleWatchlist = () => {
    if (isWatched) {
      watchlistService.removeItem(stock.symbol);
      toast.success('Removed from watchlist');
    } else {
      watchlistService.addItem({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        percentChange: stock.percentChange,
        addedAt: Date.now()
      });
      toast.success('Added to watchlist');
    }
    setIsWatched(!isWatched);
  };

  const addPriceAlert = () => {
    priceAlertService.addAlert(
      stock.symbol,
      stock.name,
      alertForm.targetPrice,
      alertForm.condition
    );
    setShowAlertForm(false);
    toast.success('Price alert added');
  };

  const removePriceAlert = (id: string) => {
    priceAlertService.removeAlert(id);
    toast.success('Price alert removed');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0A1929] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-white">{stock.symbol}</h2>
              <button
                onClick={toggleWatchlist}
                className={`p-1 rounded-full ${
                  isWatched ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                <FaStar />
              </button>
            </div>
            <p className="text-gray-400">{stock.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'chart'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'history'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'news'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            News
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Price Information */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Price Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Price</span>
                        <span className="text-white">${stock.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Change</span>
                        <span className={stock.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">High</span>
                        <span className="text-white">${stock.high.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Low</span>
                        <span className="text-white">${stock.low.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Open</span>
                        <span className="text-white">${stock.open.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Previous Close</span>
                        <span className="text-white">${stock.previousClose.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sector</span>
                        <span className="text-white">{stock.sector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Cap</span>
                        <span className="text-white">{formatNumber(stock.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volume</span>
                        <span className="text-white">{formatNumber(stock.volume)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Position */}
                  {portfolioPosition && (
                    <div className="col-span-2 bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Your Position</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-gray-400">Shares</span>
                          <div className="text-white">{portfolioPosition.shares}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Average Price</span>
                          <div className="text-white">${portfolioPosition.averagePrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Total Value</span>
                          <div className="text-white">${portfolioPosition.totalValue.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Profit/Loss</span>
                          <div className={portfolioPosition.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                            ${Math.abs(portfolioPosition.profitLoss).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Profit/Loss %</span>
                          <div className={portfolioPosition.profitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {portfolioPosition.profitLossPercentage >= 0 ? '+' : ''}{portfolioPosition.profitLossPercentage.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Alerts */}
                  <div className="col-span-2 bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Price Alerts</h3>
                      <button
                        onClick={() => setShowAlertForm(!showAlertForm)}
                        className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"
                      >
                        Add Alert
                      </button>
                    </div>

                    {showAlertForm && (
                      <div className="mb-4 p-4 bg-white/5 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Target Price</label>
                            <input
                              type="number"
                              value={alertForm.targetPrice}
                              onChange={(e) => setAlertForm({ ...alertForm, targetPrice: parseFloat(e.target.value) })}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Condition</label>
                            <select
                              value={alertForm.condition}
                              onChange={(e) => setAlertForm({ ...alertForm, condition: e.target.value as 'above' | 'below' | 'equals' })}
                              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="above">Above</option>
                              <option value="below">Below</option>
                              <option value="equals">Equals</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={addPriceAlert}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Add Alert
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white">
                              {alert.condition === 'above' ? 'Above' : alert.condition === 'below' ? 'Below' : 'Equals'} ${alert.targetPrice.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">
                              Added {new Date(alert.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => removePriceAlert(alert.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                      {alerts.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No price alerts set</p>
                      )}
                    </div>
                  </div>

                  {/* Trade Form */}
                  <div className="col-span-2 bg-white/5 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Trade</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                        <select
                          value={tradeForm.type}
                          onChange={(e) => setTradeForm({ ...tradeForm, type: e.target.value as 'buy' | 'sell' })}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="buy">Buy</option>
                          <option value="sell">Sell</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Shares</label>
                        <input
                          type="number"
                          min="1"
                          value={tradeForm.shares}
                          onChange={(e) => setTradeForm({ ...tradeForm, shares: parseInt(e.target.value) })}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Price</label>
                        <input
                          type="number"
                          value={tradeForm.price}
                          onChange={(e) => setTradeForm({ ...tradeForm, price: parseFloat(e.target.value) })}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-lg font-semibold text-white">
                        Total: ${(tradeForm.shares * tradeForm.price).toFixed(2)}
                      </div>
                      <button
                        onClick={handleTrade}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Execute Trade
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chart' && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div ref={chartContainerRef}>
                    <StockChart symbol={stock.symbol} containerRef={chartContainerRef} />
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Trading History</h3>
                  <div className="space-y-4">
                    {trades.length > 0 ? (
                      trades.map((trade) => (
                        <div key={trade.id} className="border-b border-white/10 pb-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className={`font-medium ${
                                trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {trade.type.toUpperCase()}
                              </span>
                              <span className="text-white ml-2">{trade.shares} shares</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white">${trade.total.toFixed(2)}</div>
                              <div className="text-sm text-gray-400">
                                ${trade.price.toFixed(2)} per share
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            {new Date(trade.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No trading history for this stock</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'news' && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Latest News</h3>
                  <div className="space-y-4">
                    {news.slice(0, 5).map((item, index) => (
                      <div key={index} className="border-b border-white/10 pb-4">
                        <h4 className="text-white font-medium mb-2">{item.headline}</h4>
                        <p className="text-gray-400 text-sm mb-2">{item.summary}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">{new Date(item.datetime * 1000).toLocaleDateString()}</span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 