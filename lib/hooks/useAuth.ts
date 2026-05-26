'use client'

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { setTokens, clearTokens } from '@/lib/api/client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'doctor' | 'admin' | 'staff';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  role?: 'patient' | 'doctor';
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await apiClient.get('/api/auth/profile');
        if (response.data.success) {
          setUser({
            id: response.data.user.id,
            email: response.data.user.email,
            fullName: response.data.user.full_name,
            role: response.data.user.role,
          });
        }
      } catch (error) {
        console.log('[useAuth] No authenticated user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.post('/api/auth/login', payload);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Login failed');
        }

        const { user: userData, tokens } = response.data;

        // Set tokens
        setTokens(tokens.accessToken, tokens.refreshToken);

        // Set user
        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
        });

        // Redirect to dashboard
        router.push('/dashboard');

        return { success: true };
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || 'Login failed';
        setError(errorMessage);
        console.error('[useAuth] Login error:', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const signup = useCallback(
    async (payload: SignUpPayload) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.post('/api/auth/signup', payload);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Signup failed');
        }

        const { user: userData, tokens } = response.data;

        // Set tokens
        setTokens(tokens.accessToken, tokens.refreshToken);

        // Set user
        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          role: userData.role,
        });

        // Redirect to dashboard
        router.push('/dashboard');

        return { success: true };
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || 'Signup failed';
        setError(errorMessage);
        console.error('[useAuth] Signup error:', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    router.push('/');
  }, [router]);

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
}
