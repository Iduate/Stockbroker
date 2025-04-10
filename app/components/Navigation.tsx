'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

export function Navigation() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 20;
      
      // Handle scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 400) {
        setIsVisible(false); // Hide when scrolling down and past threshold
      } else {
        setIsVisible(true); // Show when scrolling up
      }
      
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, lastScrollY]);

  return (
    <header className={`
      fixed w-full bg-gradient-to-r from-[#0f2437] via-[#132f4c] to-[#1a3a5f] 
      shadow-lg z-50 backdrop-blur-sm
      transition-all duration-300 ease-in-out
      ${scrolled ? 'py-2' : 'py-6'}
      ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      ${scrolled ? 'bg-opacity-95' : 'bg-opacity-100'}
    `}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className={`
              relative hover:scale-105 transition-all duration-300 drop-shadow-2xl
              ${scrolled ? 'w-48 h-16' : 'w-64 h-24'}
              md:${scrolled ? 'w-48 h-16' : 'w-64 h-24'}
              sm:${scrolled ? 'w-40 h-14' : 'w-48 h-16'}
            `}>
              <Image
                src="/Stock.jpg"
                alt="Stock Consortium Logo"
                width={256}
                height={96}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                priority
                className={`
                  brightness-125 contrast-125
                  transition-transform duration-300
                  ${scrolled ? 'scale-95' : 'scale-100'}
                `}
              />
            </div>
          </Link>
          <div className={`
            transition-all duration-300 hidden md:block
            ${scrolled ? 'ml-8' : 'ml-12'}
          `}>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search stocks..."
                className={`
                  bg-[#1e4976]/80 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                  transition-all duration-300 hover:bg-[#1e4976] placeholder-gray-300
                  ${scrolled ? 'px-3 py-2 w-56' : 'px-4 py-3 w-64'}
                `}
              />
              <div className="absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/offer" 
            className={`
              relative px-4 text-white font-medium hover:text-blue-300 transition-all duration-300 group
              ${scrolled ? 'py-1.5' : 'py-2'}
            `}
          >
            Offer
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/history" 
            className={`
              relative px-4 text-white font-medium hover:text-blue-300 transition-all duration-300 group
              ${scrolled ? 'py-1.5' : 'py-2'}
            `}
          >
            History
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <button 
            onClick={() => router.push('/profile')}
            className={`
              bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 
              transition-all duration-300 transform hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#132f4c]
              ${scrolled ? 'px-5 py-2' : 'px-6 py-2.5'}
            `}
          >
            Profile
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-[#1e4976] rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Menu */}
        <div className={`
          md:hidden fixed inset-0 bg-[#0f2437]/95 backdrop-blur-sm transition-transform duration-300 ease-in-out z-50
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="relative w-48 h-16 mb-8">
              <Image
                src="/Stock.jpg"
                alt="Stock Consortium Logo"
                width={192}
                height={64}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                priority
                className="brightness-125 contrast-125"
              />
            </div>
            <input
              type="text"
              placeholder="Search stocks..."
              className="bg-[#1e4976]/80 text-white px-4 py-3 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Link 
              href="/offer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-xl hover:text-blue-300 transition-colors"
            >
              Offer
            </Link>
            <Link 
              href="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-xl hover:text-blue-300 transition-colors"
            >
              History
            </Link>
            <button
              onClick={() => {
                router.push('/profile');
                setIsMobileMenuOpen(false);
              }}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg text-xl hover:bg-blue-600 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-blue-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 