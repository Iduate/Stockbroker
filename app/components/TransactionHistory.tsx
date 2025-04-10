import React, { useState, useMemo } from 'react';
import { formatCurrency, formatDate } from '../lib/utils';
import { 
  FaArrowUp, FaArrowDown, FaClock, FaCheckCircle, FaTimesCircle,
  FaSort, FaSortUp, FaSortDown, FaFilter, FaSearch
} from 'react-icons/fa';
import { Button, Input } from './ui';

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  method: string;
  createdAt: string;
  description?: string;
  reference?: string;
  fee?: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  className?: string;
}

type SortField = 'date' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, className = '' }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    method: 'all',
    search: '',
    dateRange: {
      start: '',
      end: '',
    },
    amountRange: {
      min: '',
      max: '',
    },
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? (
      <FaSortUp className="text-blue-400" />
    ) : (
      <FaSortDown className="text-blue-400" />
    );
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply filters
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.method !== 'all') {
      result = result.filter((t) => t.method.toLowerCase() === filters.method);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.reference?.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower) ||
          t.method.toLowerCase().includes(searchLower)
      );
    }
    if (filters.dateRange.start) {
      result = result.filter(
        (t) => new Date(t.createdAt) >= new Date(filters.dateRange.start)
      );
    }
    if (filters.dateRange.end) {
      result = result.filter(
        (t) => new Date(t.createdAt) <= new Date(filters.dateRange.end)
      );
    }
    if (filters.amountRange.min) {
      result = result.filter((t) => t.amount >= parseFloat(filters.amountRange.min));
    }
    if (filters.amountRange.max) {
      result = result.filter((t) => t.amount <= parseFloat(filters.amountRange.max));
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, sortField, sortDirection, filters]);

  const uniqueMethods = useMemo(() => {
    const methodSet = new Set(transactions.map((t) => t.method.toLowerCase()));
    return Array.from(methodSet);
  }, [transactions]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <FaCheckCircle className="text-green-400" />;
      case 'PENDING':
        return <FaClock className="text-yellow-400" />;
      case 'FAILED':
        return <FaTimesCircle className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'FAILED':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank':
        return '🏦';
      case 'paypal':
        return '💳';
      case 'crypto':
        return '₿';
      case 'card':
        return '💳';
      default:
        return '💱';
    }
  };

  return (
    <div className={`bg-[#132F4C] rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="pl-10 bg-white/10 border-white/20 text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <FaFilter />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="all">All Types</option>
                <option value="DEPOSIT">Deposits</option>
                <option value="WITHDRAWAL">Withdrawals</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="all">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Method
              </label>
              <select
                value={filters.method}
                onChange={(e) =>
                  setFilters({ ...filters, method: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="all">All Methods</option>
                {uniqueMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: e.target.value },
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
                <Input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: e.target.value },
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.amountRange.min}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      amountRange: { ...filters.amountRange, min: e.target.value },
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.amountRange.max}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      amountRange: { ...filters.amountRange, max: e.target.value },
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No transactions found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 px-4 py-2 text-sm font-medium text-gray-400">
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <span>Date</span>
                {getSortIcon('date')}
              </div>
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <span>Amount</span>
                {getSortIcon('amount')}
              </div>
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <span>Status</span>
                {getSortIcon('status')}
              </div>
            </div>

            {filteredAndSortedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                        {getMethodIcon(transaction.method)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">
                            {transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                          </span>
                          {transaction.type === 'DEPOSIT' ? (
                            <FaArrowUp className="text-green-400" />
                          ) : (
                            <FaArrowDown className="text-red-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          via {transaction.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          transaction.type === 'DEPOSIT'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}
                        {formatCurrency(transaction.amount, 'USD')}
                      </div>
                      {transaction.fee && (
                        <div className="text-sm text-gray-400">
                          Fee: {formatCurrency(transaction.fee, 'USD')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">
                      {formatDate(new Date(transaction.createdAt))}
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full border ${getStatusColor(
                        transaction.status
                      )} flex items-center space-x-1`}
                    >
                      {getStatusIcon(transaction.status)}
                      <span>{transaction.status}</span>
                    </div>
                  </div>

                  {transaction.description && (
                    <div className="mt-2 text-sm text-gray-400">
                      {transaction.description}
                    </div>
                  )}

                  {transaction.reference && (
                    <div className="mt-1 text-xs text-gray-500">
                      Ref: {transaction.reference}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;