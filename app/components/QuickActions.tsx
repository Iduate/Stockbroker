'use client';

import Link from 'next/link';

interface QuickActionsProps {
  isAuthenticated: boolean;
}

export default function QuickActions({ isAuthenticated }: QuickActionsProps) {
  return (
    <div className="bg-[#172a46] p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <Link 
          href="/offer" 
          className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
        >
          View All Stocks
        </Link>
        {isAuthenticated && (
          <Link 
            href="/portfolio" 
            className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition-colors"
          >
            My Portfolio
          </Link>
        )}
      </div>
    </div>
  );
} 