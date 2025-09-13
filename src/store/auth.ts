import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { userService, RegisterUserData } from '@/services/userService';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  register: (userData: RegisterUserData) => Promise<void>;
  loginWithCredentials: (email: string, senha: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User, token: string) => {
        // Salvar token como cookie para o middleware
        if (typeof document !== 'undefined') {
          document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
        }
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Remover cookie de autenticação
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      register: async (userData: RegisterUserData) => {
        set({ isLoading: true });
        try {
          const response = await userService.register(userData);
          
          if (response.success && response.user && response.token) {
            // Salvar token no localStorage
            localStorage.setItem('auth_token', response.token);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || 'Erro ao criar conta');
          }
        } catch (error: unknown) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithCredentials: async (email: string, senha: string) => {
        set({ isLoading: true });
        try {
          const response = await userService.login(email, senha);
          
          if (response.success && response.user && response.token) {
            // Salvar token no localStorage
            localStorage.setItem('auth_token', response.token);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || 'Erro ao fazer login');
          }
        } catch (error: unknown) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);







