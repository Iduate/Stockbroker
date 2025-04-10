'use client';

import { useEffect, useState } from 'react';

export default function SeedPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function seedDatabase() {
      try {
        const response = await fetch('/api/seed', {
          method: 'POST'
        });
        const data = await response.json();
        if (response.ok) {
          setMessage(data.message);
          setError('');
        } else {
          setMessage('');
          setError(data.error + (data.details ? `: ${data.details}` : ''));
        }
      } catch (error) {
        setMessage('');
        setError('Error connecting to the server');
      }
    }

    seedDatabase();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Seeding Database</h1>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!message && !error && <p>Seeding in progress...</p>}
      </div>
    </div>
  );
} 