'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import countries from '@/utils/countries';

interface RegistrationData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || 
          !formData.phoneNumber || !formData.dateOfBirth || !formData.country) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Make API call to register
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          country: formData.country,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setToken(data.token);

      // Show success message and redirect
      toast.success('Account created successfully! Welcome to our platform.');
      router.push('/home');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4 bg-gray-800 p-6 rounded-lg">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-300">
                Middle Name
              </label>
              <input
                id="middleName"
                name="middleName"
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">
                Date of Birth *
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-300">
                Country *
              </label>
              <select
                id="country"
                name="country"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="" className="bg-gray-700 text-white">Select a country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code} className="bg-gray-700 text-white">
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 






