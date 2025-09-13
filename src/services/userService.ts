import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants';
import { User } from '@/types';

export interface RegisterUserData {
  nome: string;
  email: string;
  senha: string;
  plano?: string;
  consentimentoLGPD: boolean;
  consentimentoMarketing?: boolean;
  consentimentoAnalytics?: boolean;
  dataConsentimento?: string;
  ipConsentimento?: string;
  userAgentConsentimento?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

class UserService {
  /**
   * Busca dados do usuário logado
   */
  async getUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/usuarios/me');
      return response.data || (response as unknown as User);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  }

  /**
   * Verifica código de login (faz login direto)
   */
  async verifyCode(email: string, codigo: string): Promise<{ token: string; nome: string; plano: string; user?: User }> {
    try {
      const response = await apiClient.post<{ token: string; nome: string; plano: string; user?: User }>('/login/verificar', {
        email,
        codigo
      });
      return response.data || response as unknown as { token: string; nome: string; plano: string; user?: User };
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      throw error;
    }
  }

  /**
   * Cadastra um novo usuário no backend
   */
  async register(userData: RegisterUserData): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<unknown>(
        'usuarios',
        {
          ...userData,
          dataConsentimento: userData.dataConsentimento || new Date().toISOString(),
          ipConsentimento: userData.ipConsentimento || '127.0.0.1',
          userAgentConsentimento: userData.userAgentConsentimento || navigator.userAgent,
        }
      );

      // O backend retorna o usuário diretamente, não em um wrapper
      const user = (response as unknown) as { id: number; nome: string; email: string; createdAt: string | null; updatedAt: string | null };
      
      console.log('🔍 [DEBUG] Resposta do backend:', user);
      console.log('🔍 [DEBUG] User ID:', user?.id);
      
      if (user && user.id) {
        // Transformar a resposta do backend para o formato esperado
        const transformedResponse = {
          success: true,
          message: 'Usuário criado com sucesso',
          user: {
            id: user.id.toString(),
            email: user.email,
            name: user.nome,
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
          },
          token: 'mock-token-' + user.id, // TODO: Implementar geração real de token
        };
        
        console.log('✅ [DEBUG] Resposta transformada:', transformedResponse);
        return transformedResponse;
      } else {
        console.error('❌ [DEBUG] Usuário inválido:', user);
        return { success: false, message: 'Resposta inválida do servidor' };
      }
    } catch (error: unknown) {
      console.error('Erro ao cadastrar usuário:', error);
      
      // Tratar diferentes tipos de erro
      const axiosError = error as { response?: { status: number; data?: { message?: string } }; code?: string };
      if (axiosError.response?.status === 400) {
        // Mostrar a mensagem específica do backend para validação de senha
        const backendMessage = axiosError.response?.data?.message;
        if (backendMessage && backendMessage.includes('Senha não atende aos requisitos')) {
          throw new Error(backendMessage);
        }
        throw new Error('Dados inválidos. Verifique as informações fornecidas.');
      } else if (axiosError.response?.status === 409) {
        throw new Error('Este email já está cadastrado. Tente fazer login.');
      } else if (axiosError.response?.status === 500) {
        throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
      } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        throw new Error(axiosError.response?.data?.message || 'Erro inesperado. Tente novamente.');
      }
    }
  }

  /**
   * Faz login do usuário
   */
  async login(email: string, senha: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<unknown>(
        'auth/login',
        { email, senha }
      );

      // O backend pode retornar o usuário diretamente ou em um wrapper
      const data = (response as unknown) as { id?: number; user?: { id: number; nome: string; email: string; createdAt: string | null; updatedAt: string | null }; token?: string } | { id: number; nome: string; email: string; createdAt: string | null; updatedAt: string | null };
      
      if (data && (data.id || (data as { user?: unknown }).user)) {
        const user = (data as { user?: { id: number; nome: string; email: string; createdAt: string | null; updatedAt: string | null } }).user || data as { id: number; nome: string; email: string; createdAt: string | null; updatedAt: string | null };
        return {
          success: true,
          message: 'Login realizado com sucesso',
          user: {
            id: user.id.toString(),
            email: user.email,
            name: user.nome,
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
          },
          token: (data as { token?: string }).token || 'mock-token-' + user.id, // TODO: Implementar geração real de token
        };
      } else {
        return { success: false, message: 'Credenciais inválidas' };
      }
    } catch (error: unknown) {
      console.error('Erro ao fazer login:', error);
      
      const axiosError = error as { response?: { status: number; data?: { message?: string } }; code?: string };
      if (axiosError.response?.status === 401) {
        throw new Error('Email ou senha incorretos.');
      } else if (axiosError.response?.status === 400) {
        throw new Error('Dados inválidos. Verifique as informações fornecidas.');
      } else if (axiosError.response?.status === 500) {
        throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
      } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        throw new Error(axiosError.response?.data?.message || 'Erro inesperado. Tente novamente.');
      }
    }
  }

  /**
   * Obtém dados do usuário logado
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('usuarios/me');
      if (!response) {
        throw new Error('Resposta inválida do servidor');
      }
      // Garante que o objeto retornado realmente é um User válido
      const user = (response as unknown) as User;
      if (
        !user.id ||
        !user.email ||
        !user.name ||
        !user.createdAt ||
        !user.updatedAt
      ) {
        throw new Error('Dados do usuário incompletos recebidos do servidor');
      }
      return user;
    } catch (error: unknown) {
      console.error('Erro ao obter dados do usuário:', error);
      throw new Error('Erro ao carregar dados do usuário.');
    }
  }

  /**
   * Atualiza dados do usuário
   */
  async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(
        'usuarios/me',
        userData
      );
      if (!response) {
        throw new Error('Resposta inválida do servidor');
      }
      return (response as unknown) as User;
    } catch (error: unknown) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Erro ao atualizar dados do usuário.');
    }
  }

  /**
   * Verifica se o email já está cadastrado
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      await apiClient.get(`usuarios/check-email?email=${encodeURIComponent(email)}`);
      return true;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 404) {
        return false; // Email não existe
      }
      throw error; // Outros erros
    }
  }
}

export const userService = new UserService();
