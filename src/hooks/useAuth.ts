'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, updateUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    if (!isAuthenticated && !isLoading) {
      setLoading(true);
      // You can add token validation logic here
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, setLoading]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Add your login API call here
      // const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      // login(response.data.user, response.data.token);
      
      // Mock login for now
      const mockUser = {
        id: '1',
        email,
        name: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      login(mockUser, 'mock-token');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    updateUser,
  };
};
