'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface ResetResponse {
  message: string;
  success?: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email) {
        throw new Error('Please enter your email address');
      }

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request password reset');
      }

      setRequestSent(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (err: any) {
      console.error('Reset request error:', err);
      setError(err.message || 'Failed to request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: newPassword,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      toast.success('Password has been reset successfully');
      router.push('/auth/login');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1629]">
      <div className="bg-[#172a46] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {token ? 'Reset Your Password' : 'Forgot Password'}
        </h1>

        {!token ? (
          <>
            {!requestSent ? (
              <form onSubmit={handleRequestReset} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#0c1629] border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter your email"
                  />
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
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-green-400">
                  Check your email for password reset instructions.
                </p>
                <p className="text-gray-400">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setRequestSent(false)}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Try again
                  </button>
                </p>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#0c1629] border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter new password"
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#0c1629] border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                placeholder="Confirm new password"
                minLength={8}
              />
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-gray-400">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-400">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
} 