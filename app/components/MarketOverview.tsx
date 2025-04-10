'use client';

import Link from 'next/link';

interface MarketOverviewProps {
  isAuthenticated: boolean;
}

export default function MarketOverview({ isAuthenticated }: MarketOverviewProps) {
  return (
    <div className="bg-[#172a46] p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
      <p className="text-gray-400 mb-6">
        Track real-time stock prices, manage your portfolio, and make informed investment decisions.
      </p>
      {!isAuthenticated ? (
        <Link 
          href="/auth/account-type" 
          className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
        >
          Sign In / Register
        </Link>
      ) : (
        <Link 
          href="/profile" 
          className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
        >
          View Profile
        </Link>
      )}
    </div>
  );
} 