'use client';

import { type Stock } from '../types';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface StocksTableProps {
  stocks: Stock[];
  onStockSelect: (stock: Stock) => void;
  sortConfig: { key: keyof Stock; direction: 'asc' | 'desc' } | null;
  onSort: (key: keyof Stock) => void;
}

export default function StocksTable({
  stocks,
  onStockSelect,
  sortConfig,
  onSort,
}: StocksTableProps) {
  const getSortIcon = (key: keyof Stock) => {
    if (sortConfig?.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="text-blue-500" />
    ) : (
      <FaSortDown className="text-blue-500" />
    );
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('symbol')}
            >
              <div className="flex items-center">
                Symbol
                {getSortIcon('symbol')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Name
                {getSortIcon('name')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('price')}
            >
              <div className="flex items-center">
                Price
                {getSortIcon('price')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('changePercent')}
            >
              <div className="flex items-center">
                Change
                {getSortIcon('changePercent')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('marketCap')}
            >
              <div className="flex items-center">
                Market Cap
                {getSortIcon('marketCap')}
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#0A1929] divide-y divide-gray-700">
          {stocks.map((stock) => (
            <tr
              key={stock.symbol}
              className="hover:bg-gray-800 cursor-pointer"
              onClick={() => onStockSelect(stock)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {stock.symbol}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {stock.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                ${formatNumber(stock.price)}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm ${
                  stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatPercent(stock.changePercent)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${formatNumber(stock.marketCap || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStockSelect(stock);
                  }}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 