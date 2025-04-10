'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
});

export const useAuth = () => useContext(AuthContext);

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/offer'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(token);
          } else {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setToken]);

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route);
      
      // Only redirect to login if trying to access a protected route while not authenticated
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/auth/login');
      }
      // Only redirect to home if trying to access login while already authenticated
      else if (isAuthenticated && pathname === '/auth/login') {
        router.push('/home');
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
} 