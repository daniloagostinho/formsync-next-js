'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { userService } from '@/services/userService';
import { logger } from '@/utils/logger';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && (typeof window !== 'undefined' ? !!localStorage.getItem('auth_token') : false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we're in the browser
        if (typeof window === 'undefined') {
          logger.info('Running on server, skipping auth check');
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('auth_token');
        logger.info('Auth initialization', { tokenFound: !!token });
        
        if (token) {
          logger.info('Token found, attempting to get user data');
          try {
            // Verify token and get user data
            const userData = await userService.getUser();
            logger.info('User data received', { userData });
            
            if (userData) {
              setUser(userData);
              logger.info('User set successfully');
            } else {
              logger.warn('No user data, clearing tokens');
              // Token is invalid, clear it
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
            }
          } catch (error) {
            logger.error('Error getting user data', { error: error.message });
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        } else {
          logger.info('No token found, skipping auth check');
        }
      } catch (error) {
        console.error('❌ [AUTH_INIT] Error initializing auth:', error);
        // Clear invalid tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // First, send the login request to get a code
      await userService.login(email, password);
      
      // For now, we'll use the bypass code for testing
      // In production, the user would receive the code via email
      const response = await userService.verifyCode(email, '123456');
      
      if (response.token) {
        const user = {
          id: response.user?.id || '1',
          nome: response.nome,
          email: email,
          plano: response.plano
        };
        setUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(user));
          logger.info('Token salvo no localStorage', { tokenLength: response.token.length });
        }
        logger.info('Login realizado com sucesso', { user: { id: user.id, email: user.email } });
        return { success: true };
      } else {
        logger.error('Token não recebido na resposta de login', { response });
        return { success: false, message: 'Erro ao fazer login' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await userService.register(userData);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Erro ao registrar usuário' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logger.info('Logout realizado', { user: user?.email });
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      logger.info('Tokens removidos do localStorage');
    }
  };

  const refreshUser = async () => {
    try {
      // Only refresh if we have a token
      if (typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
        const userData = await userService.getUser();
        if (userData) {
          setUser(userData);
          localStorage.setItem('user_data', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
