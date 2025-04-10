'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Incorrect email or password');
      }

      // Redirect to home page on successful sign in
      router.push('/home');
    } catch (error) {
      setError('Incorrect email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      // Move to verification code step
      setResetStep('code');
      setError('Verification code has been sent to your email');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: resetEmail,
          code: verificationCode 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      // Move to new password step
      setResetStep('newPassword');
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail,
          code: verificationCode,
          newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      // Reset all states and show success
      setShowForgotPassword(false);
      setResetStep('email');
      setResetEmail('');
      setVerificationCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setError('Password has been successfully updated');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-300">
              {resetStep === 'email' && 'Enter your email to receive a verification code'}
              {resetStep === 'code' && 'Enter the verification code sent to your email'}
              {resetStep === 'newPassword' && 'Create your new password'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/20">
            {resetStep === 'email' && (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-200">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    name="resetEmail"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-900/20 p-4 border border-red-500/50">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetStep('email');
                      setError('');
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Back to Sign In
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? 'Sending...' : 'Send Code'}
                  </button>
                </div>
              </form>
            )}

            {resetStep === 'code' && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-200">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter verification code"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-900/20 p-4 border border-red-500/50">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setResetStep('email')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </form>
            )}

            {resetStep === 'newPassword' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                    minLength={8}
                  />
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-200">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                    minLength={8}
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-900/20 p-4 border border-red-500/50">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setResetStep('code')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to manage your accounts
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setError('');
                }}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot your password?
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-red-900/20 p-4 border border-red-500/50">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 