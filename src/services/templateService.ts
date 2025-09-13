import { apiClient } from '@/api/client';
import { Template, SimpleTemplate } from '@/types';

class TemplateService {
  /**
   * Lista todos os templates do usuário
   */
  async listarTemplates(usuarioId?: number): Promise<Template[]> {
    try {
      // TEMPORÁRIO: Forçar uso do ID correto do usuário de teste
      const userId = usuarioId || 27; // ID do usuário de teste criado
      
      console.log('🔍 [DEBUG] listarTemplates - usuarioId recebido:', usuarioId);
      console.log('🔍 [DEBUG] listarTemplates - userId final (forçado):', userId);
      
      if (!userId) {
        throw new Error('ID do usuário não encontrado. Faça login novamente.');
      }

      const url = `/templates/usuario/${userId}`;
      console.log('🔍 [DEBUG] listarTemplates - URL:', url);
      
      const response = await apiClient.get<Template[]>(url);
      console.log('✅ [DEBUG] listarTemplates - Resposta:', response.status, response.data);
      
      return response.data || [];
    } catch (error) {
      console.error('❌ [DEBUG] Erro ao listar templates:', error);
      throw error;
    }
  }

  /**
   * Obtém o ID do usuário atual do localStorage
   */
  private getCurrentUserId(): number | null {
    if (typeof window === 'undefined') return null;
    
    try {
      console.log('🔍 [DEBUG] Buscando ID do usuário...');
      
      // Tentar obter do Zustand store primeiro
      const authStorage = localStorage.getItem('auth-storage');
      console.log('🔍 [DEBUG] auth-storage:', authStorage);
      
      if (authStorage) {
        const auth = JSON.parse(authStorage);
        console.log('🔍 [DEBUG] auth parsed:', auth);
        if (auth.state?.user?.id) {
          const userId = parseInt(auth.state.user.id);
          console.log('✅ [DEBUG] ID encontrado no Zustand store:', userId);
          return userId;
        }
      }
      
      // Fallback para user_data
      const userData = localStorage.getItem('user_data');
      console.log('🔍 [DEBUG] user_data:', userData);
      
      if (userData) {
        const user = JSON.parse(userData);
        console.log('🔍 [DEBUG] user parsed:', user);
        if (user.id) {
          const userId = parseInt(user.id);
          console.log('✅ [DEBUG] ID encontrado no user_data:', userId);
          return userId;
        }
      }
      
      // Se não encontrar, usar ID padrão para teste
      console.warn('⚠️ [DEBUG] ID do usuário não encontrado, usando ID padrão para teste');
      return 27; // ID do usuário de teste criado
      
    } catch (error) {
      console.error('❌ [DEBUG] Erro ao obter ID do usuário:', error);
      return 27; // ID do usuário de teste como fallback
    }
  }

  /**
   * Cria um novo template
   */
  async criarTemplate(templateData: SimpleTemplate): Promise<SimpleTemplate | null> {
    try {
      const userId = 27; // TEMPORÁRIO: ID do usuário de teste
      if (!userId) {
        throw new Error('ID do usuário não encontrado. Faça login novamente.');
      }

      // Converter SimpleTemplate para TemplateDTO com usuarioId
      const templateDTO = {
        ...templateData,
        usuarioId: userId
      };

      const response = await apiClient.post<SimpleTemplate>('/templates', templateDTO);
      return response.data || null;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      throw error;
    }
  }

  /**
   * Atualiza um template existente
   */
  async atualizarTemplate(templateId: number, templateData: SimpleTemplate): Promise<any> {
    try {
      const userId = 27; // TEMPORÁRIO: ID do usuário de teste
      if (!userId) {
        throw new Error('ID do usuário não encontrado. Faça login novamente.');
      }

      // Converter SimpleTemplate para TemplateDTO com usuarioId
      const templateDTO = {
        ...templateData,
        usuarioId: userId
      };

      const response = await apiClient.put(`/templates/${templateId}?usuarioId=${userId}`, templateDTO);
      return response.data || response;
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      throw error;
    }
  }

  /**
   * Deleta um template
   */
  async deletarTemplate(templateId: number): Promise<void> {
    try {
      const userId = 27; // TEMPORÁRIO: ID do usuário de teste
      if (!userId) {
        throw new Error('ID do usuário não encontrado. Faça login novamente.');
      }

      await apiClient.delete(`/templates/${templateId}/usuario?usuarioId=${userId}`);
    } catch (error) {
      console.error('Erro ao deletar template:', error);
      throw error;
    }
  }

  /**
   * Obtém um template específico por ID
   */
  async obterTemplate(templateId: number): Promise<Template> {
    try {
      const userId = 27; // TEMPORÁRIO: ID do usuário de teste
      if (!userId) {
        throw new Error('ID do usuário não encontrado. Faça login novamente.');
      }

      const response = await apiClient.get<Template>(`/templates/${templateId}?usuarioId=${userId}`);
      return response.data || (response as unknown as Template);
    } catch (error) {
      console.error('Erro ao obter template:', error);
      throw error;
    }
  }
}

export const templateService = new TemplateService();