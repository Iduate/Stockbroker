import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Use port 3001 since that's where our backend server is running
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => {
        if (user) {
          set({
            user,
            isAuthenticated: true,
            error: null
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        }
      },
      setIsAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated });
      },
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          // Store token in localStorage
          localStorage.setItem('token', data.token);

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
          });

          // Clear token from localStorage
          localStorage.removeItem('token');

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Redirect to login page
          window.location.href = '/auth/login';
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Logout failed',
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const data = JSON.parse(str);
            // Check for token in localStorage
            const token = localStorage.getItem('token');
            if (token) {
              return {
                state: {
                  user: data.state?.user || null,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null
                }
              };
            }
            return data;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
); 