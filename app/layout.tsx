import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './components/ClientLayout';

export const metadata: Metadata = {
  title: 'Stock Trading App',
  description: 'A modern stock trading platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
