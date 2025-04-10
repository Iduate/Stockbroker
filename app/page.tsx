'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from './providers/AuthProvider';
import dynamic from 'next/dynamic';

const FeaturedStocks = dynamic(() => import('./components/FeaturedStocks'), {
  ssr: false,
});

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0c1629] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">
            Welcome to StockConsortium.com
          </h1>
          <p className="text-gray-400 text-center mb-12">
            Your Premier Stock Trading Platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#172a46] p-6 rounded-lg animate-pulse h-48" />
            <div className="bg-[#172a46] p-6 rounded-lg animate-pulse h-48" />
            <div className="bg-[#172a46] p-6 rounded-lg animate-pulse h-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1629] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Welcome to StockConsortium.com
        </h1>
        <p className="text-gray-400 text-center mb-12">
          {user ? `Welcome back, ${user.firstName}!` : 'Your Premier Stock Trading Platform'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="bg-[#172a46] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link 
                href="/offer" 
                className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
              >
                View All Stocks
              </Link>
              {user && (
                <Link 
                  href="/portfolio" 
                  className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition-colors"
                >
                  My Portfolio
                </Link>
              )}
            </div>
          </div>

          <div className="bg-[#172a46] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Featured Stocks</h2>
            <FeaturedStocks />
          </div>
        </div>
      </div>
    </div>
  );
}
