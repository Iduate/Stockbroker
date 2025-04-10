'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-[#0c1629] to-[#131f3d] border-b border-gray-800 shadow-xl backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative w-80 h-24">
                <Image
                  src="/Stock.jpg"
                  alt="Stock Consortium"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  className="brightness-150 contrast-125"
                />
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stocks..."
                  className="w-full px-4 py-3 pl-10 bg-[#1a2744]/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                href="/home"
                className={`text-white hover:text-blue-400 transition-colors ${
                  pathname === '/home' ? 'text-blue-400' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/offer"
                className={`text-white hover:text-blue-400 transition-colors ${
                  pathname === '/offer' ? 'text-blue-400' : ''
                }`}
              >
                Offer
              </Link>
              <Link
                href="/history"
                className={`text-white hover:text-blue-400 transition-colors ${
                  pathname === '/history' ? 'text-blue-400' : ''
                }`}
              >
                History
              </Link>
              <Link
                href="/profile"
                className={`text-white hover:text-blue-400 transition-colors ${
                  pathname === '/profile' ? 'text-blue-400' : ''
                }`}
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer div to prevent content from being hidden under navbar */}
      <div className="h-28" />
    </>
  );
} 