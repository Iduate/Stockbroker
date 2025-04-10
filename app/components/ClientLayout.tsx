'use client';

import { Inter } from 'next/font/google';
import Navbar from './Navbar';
import Footer from './Footer';
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 