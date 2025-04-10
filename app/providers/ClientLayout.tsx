'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './AuthProvider';
import { SessionProvider } from 'next-auth/react';
import { Navigation } from '../components/Navigation';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <Navigation />
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </SessionProvider>
  );
} 