'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { transactionService } from '../services/api';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'profit';
  symbol?: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  details: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Transaction['type'] | 'all'>('all');
  const [dateRange, setDateRange] = useState<'1d' | '1w' | '1m' | '3m' | '1y' | 'all'>('all');
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0
  });

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await transactionService.getTransactions({
        type: filter !== 'all' ? filter : undefined,
        dateRange,
        page: pagination.page,
        limit: pagination.limit
      });
      setTransactions(response.data.transactions);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      toast.error('Failed to load transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter, dateRange, pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'text-blue-500';
      case 'sell':
        return 'text-red-500';
      case 'deposit':
        return 'text-green-500';
      case 'profit':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow border border-white/10">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Transaction History</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as Transaction['type'] | 'all')}
                  className="w-full rounded-md bg-white/5 border-white/10 text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [&>option]:bg-[#0A1929] [&>option]:text-gray-300"
                >
                  <option value="all">All Transactions</option>
                  <option value="buy">Buys</option>
                  <option value="sell">Sells</option>
                  <option value="deposit">Deposits</option>
                  <option value="profit">Profits</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                  className="w-full rounded-md bg-white/5 border-white/10 text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [&>option]:bg-[#0A1929] [&>option]:text-gray-300"
                >
                  <option value="all">All Time</option>
                  <option value="1d">Last 24 Hours</option>
                  <option value="1w">Last Week</option>
                  <option value="1m">Last Month</option>
                  <option value="3m">Last 3 Months</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.type === 'buy' ? 'bg-green-900/50 text-green-300' :
                              transaction.type === 'sell' ? 'bg-red-900/50 text-red-300' :
                              transaction.type === 'deposit' ? 'bg-blue-900/50 text-blue-300' :
                              'bg-purple-900/50 text-purple-300'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {transaction.symbol || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-900/50 text-green-300' :
                              transaction.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300' :
                              'bg-red-900/50 text-red-300'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {transaction.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400">
                    Showing {transactions.length} of {pagination.total} transactions
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 rounded-md border border-white/10 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page * pagination.limit >= pagination.total}
                      className="px-3 py-1 rounded-md border border-white/10 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 