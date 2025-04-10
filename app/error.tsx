'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">Something went wrong!</h1>
        <p className="text-xl text-blue-200/80 mb-8">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="bg-[#1B2B3A]/70 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/10">
          <button
            onClick={reset}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-300"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
} 