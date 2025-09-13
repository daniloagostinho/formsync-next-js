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
      // Para o backend atual, precisamos usar o fluxo de código por email
      // Primeiro, enviar código
      await userService.sendLoginCode(email);
      
      // Por enquanto, usar código de bypass (123456) para teste
      const response = await userService.verifyCode(email, '123456');
      
      if (response.token) {
        const user = {
          id: '27', // ID do usuário de teste criado
          email: response.email, // Usar email real do backend
          name: response.nome,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        login(user, response.token);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
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
