'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    setError('');

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1629]">
      <div className="bg-[#172a46] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Login to Your Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0c1629] border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0c1629] border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <Link href="/auth/reset-password" className="text-sm text-blue-500 hover:text-blue-400">
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors
              ${isLoading 
                ? 'bg-blue-600/50 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-blue-500 hover:text-blue-400">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
} 