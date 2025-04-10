"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface UserProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">First Name</label>
                  <div className="mt-1 text-white">{profile?.firstName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Middle Name</label>
                  <div className="mt-1 text-white">{profile?.middleName || 'Not provided'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Last Name</label>
                  <div className="mt-1 text-white">{profile?.lastName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <div className="mt-1 text-white">{profile?.email}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                  <div className="mt-1 text-white">{profile?.phoneNumber}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
                  <div className="mt-1 text-white">{profile?.dateOfBirth}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Country</label>
                  <div className="mt-1 text-white">{profile?.country}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 