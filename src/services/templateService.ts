import { apiClient } from '@/api/client';

export interface Template {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  totalUso: number;
  ultimoUso?: string;
  campos: CampoTemplate[];
}

export interface CampoTemplate {
  id: number;
  nome: string;
  valor: string;
  tipo: string;
  ordem: number;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  totalUso: number;
  ultimoUso?: string;
}

export interface TemplateResponse {
  success: boolean;
  data: Template[];
  message?: string;
}

class TemplateService {
  /**
   * Lista todos os templates do usuário
   */
  async listarTemplates(): Promise<TemplateResponse> {
    try {
      const response = await apiClient.get<Template[]>('/templates');
      
      return {
        success: true,
        data: response || [],
      };
    } catch (error) {
      console.error('Erro ao listar templates:', error);
      return {
        success: false,
        data: [],
        message: 'Erro ao carregar templates',
      };
    }
  }

  /**
   * Lista todos os templates do usuário (método simplificado)
   */
  async getTemplates(): Promise<Template[]> {
    try {
      const response = await apiClient.get<Template[]>('/templates');
      return response || [];
    } catch (error) {
      console.error('Erro ao listar templates:', error);
      return [];
    }
  }

  /**
   * Busca templates por termo
   */
  async buscarTemplates(termo: string): Promise<TemplateResponse> {
    try {
      const response = await apiClient.get<Template[]>(`/templates/search?q=${encodeURIComponent(termo)}`);
      
      return {
        success: true,
        data: response || [],
      };
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      return {
        success: false,
        data: [],
        message: 'Erro ao buscar templates',
      };
    }
  }

  /**
   * Cria um novo template
   */
  async criarTemplate(templateData: Partial<Template>): Promise<{ success: boolean; data?: Template; message?: string }> {
    try {
      const response = await apiClient.post<Template>('/templates', templateData);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Erro ao criar template:', error);
      return {
        success: false,
        message: 'Erro ao criar template',
      };
    }
  }

  /**
   * Atualiza um template existente
   */
  async atualizarTemplate(id: number, templateData: Partial<Template>): Promise<{ success: boolean; data?: Template; message?: string }> {
    try {
      const response = await apiClient.put<Template>(`/templates/${id}`, templateData);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      return {
        success: false,
        message: 'Erro ao atualizar template',
      };
    }
  }

  /**
   * Deleta um template
   */
  async deletarTemplate(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      await apiClient.delete(`/templates/${id}`);
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Erro ao deletar template:', error);
      return {
        success: false,
        message: 'Erro ao deletar template',
      };
    }
  }
}

export const templateService = new TemplateService();
