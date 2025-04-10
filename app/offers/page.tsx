'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { offerService } from '../services/api';
import { toast } from 'react-hot-toast';
import PaymentMethodsModal from '../components/PaymentMethodsModal';

interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'bonus' | 'discount' | 'promotion';
  value: string;
  expiryDate: string;
  terms: string[];
  isActive: boolean;
  stockSymbol?: string;
  stockPrice?: number;
}

// Loading skeleton component for better UX
const OfferSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-3/4">
        <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
      <div className="h-6 bg-white/10 rounded w-20"></div>
    </div>
    <div className="mb-4">
      <div className="h-8 bg-white/10 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-1/3"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-white/10 rounded w-full"></div>
      <div className="h-4 bg-white/10 rounded w-5/6"></div>
      <div className="h-4 bg-white/10 rounded w-4/6"></div>
    </div>
    <div className="h-10 bg-white/10 rounded w-full"></div>
  </div>
);

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expired'>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    price: number;
    quantity: number;
  } | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }
  }, [router]);

  const fetchOffers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = activeTab === 'active'
        ? await offerService.getActiveOffers()
        : await offerService.getOffers();
      setOffers(response.data);
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      if (error.response?.status === 401) {
        router.push('/signin');
      } else {
        setError(error.response?.data?.message || 'Failed to load offers. Please try again later.');
        toast.error('Failed to load offers');
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchOffers();
    }
  }, [fetchOffers]);

  const handleActivateOffer = async (offerId: string) => {
    try {
      await offerService.activateOffer(offerId);
      toast.success('Offer activated successfully');
      fetchOffers();
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/signin');
      } else {
        toast.error('Failed to activate offer');
        console.error('Error activating offer:', error);
      }
    }
  };

  const handleBuyStock = (stockSymbol: string, stockPrice: number) => {
    setSelectedStock({
      symbol: stockSymbol,
      price: stockPrice,
      quantity: 1, // Default quantity
    });
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    if (!selectedStock) return;

    try {
      // Here you would implement the actual payment processing logic
      await offerService.processPayment({
        stockSymbol: selectedStock.symbol,
        quantity: selectedStock.quantity,
        amount: selectedStock.price * selectedStock.quantity,
      });
      
      toast.success('Payment processed successfully');
      setShowPaymentModal(false);
      setSelectedStock(null);
    } catch (error) {
      toast.error('Failed to process payment');
      console.error('Payment error:', error);
    }
  };

  const filteredOffers = offers.filter(offer => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return offer.isActive;
    return !offer.isActive;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929]">
      <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/home')}
                className="text-xl font-bold text-white hover:text-blue-400"
              >
                Trading Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/home')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Special Offers</h1>
          <p className="text-gray-400">Take advantage of our exclusive trading offers and promotions</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            All Offers
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Active Offers
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'expired'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Expired Offers
          </button>
        </div>

        {/* Offers list with loading skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <OfferSkeleton />
              <OfferSkeleton />
              <OfferSkeleton />
              <OfferSkeleton />
            </>
          ) : error ? (
            <div className="col-span-2 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
              {error}
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
              <p className="text-gray-400">No offers available at the moment.</p>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:border-blue-500 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">{offer.title}</h2>
                    <p className="text-gray-400">{offer.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    offer.type === 'bonus' ? 'bg-green-100 text-green-800' :
                    offer.type === 'discount' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {offer.type.toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-white mb-2">{offer.value}</div>
                  <div className="text-sm text-gray-400">Expires: {new Date(offer.expiryDate).toLocaleDateString()}</div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Terms & Conditions:</h3>
                  <ul className="space-y-2">
                    {offer.terms.map((term, index) => (
                      <li key={index} className="text-sm text-gray-400 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {term}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleActivateOffer(offer.id)}
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                    offer.isActive
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                  disabled={!offer.isActive}
                >
                  {offer.isActive ? 'Activate Offer' : 'Offer Expired'}
                </button>

                {offer.stockSymbol && offer.stockPrice && (
                  <button
                    onClick={() => handleBuyStock(offer.stockSymbol!, offer.stockPrice!)}
                    className="w-full py-2 px-4 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700"
                  >
                    Buy {offer.stockSymbol}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Payment Methods Modal */}
      {selectedStock && (
        <PaymentMethodsModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedStock(null);
          }}
          stockSymbol={selectedStock.symbol}
          stockPrice={selectedStock.price}
          quantity={selectedStock.quantity}
        />
      )}
    </div>
  );
} 