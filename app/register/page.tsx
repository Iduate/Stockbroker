'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Get selected accounts from localStorage
    const accounts = localStorage.getItem('selectedAccounts');
    if (!accounts) {
      // If no accounts were selected, redirect back to account selection
      router.push('/');
      return;
    }
    setSelectedAccounts(JSON.parse(accounts));
  }, [router]);

  // Don't render the form until we have the selected accounts
  if (selectedAccounts.length === 0) {
    return null;
  }

  return <RegisterForm selectedAccounts={selectedAccounts} />;
} 