'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { templateService } from '@/services/templateService';
import { userService } from '@/services/userService';
import { logger } from '@/utils/logger';
import DashboardLayout from '@/components/DashboardLayout';

interface Template {
  id: string;
  nome: string;
  descricao?: string;
  campos?: Array<{ nome: string; valor: string }>;
  totalUso?: number;
  ultimoUso?: string;
  dataCriacao?: string;
}

interface User {
  nome: string;
  email: string;
  plano: string;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  // Função para calcular último preenchimento
  const calculateLastFill = (templates: Template[]): string => {
    if (!templates || templates.length === 0) {
      return 'Nunca';
    }

    const templatesComUso = templates.filter(template => template.ultimoUso && template.ultimoUso !== '');

    if (templatesComUso.length === 0) {
      return 'Nunca';
    }

    // Encontrar o template com uso mais recente
    const templateMaisRecente = templatesComUso.sort((a, b) => {
      const dataA = new Date(a.ultimoUso!);
      const dataB = new Date(b.ultimoUso!);
      return dataB.getTime() - dataA.getTime();
    })[0];

    const dataUltimo = new Date(templateMaisRecente.ultimoUso!);
    const agora = new Date();
    const diffHoras = Math.floor(
      (agora.getTime() - dataUltimo.getTime()) / (1000 * 60 * 60),
    );

    if (diffHoras < 1) {
      return 'Agora mesmo';
    } else if (diffHoras < 24) {
      return `Há ${diffHoras} horas`;
    } else {
      const diffDias = Math.floor(diffHoras / 24);
      return `Há ${diffDias} dias`;
    }
  };

  // Estatísticas calculadas
  const totalTemplates = templates.length;
  const formulariosPreenchidos = templates.reduce((total, template) => total + (template.totalUso || 0), 0);
  const ultimoPreenchimento = calculateLastFill(templates);

  useEffect(() => {
    if (!isAuthenticated) {
      setMessage('⚠️ Faça login para acessar o dashboard.');
      setLoading(false);
      return;
    }

    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      logger.info('Dashboard loadDashboardData iniciado', { isAuthenticated, user: !!user });
      
      // Verificar se há token válido antes de fazer chamadas
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      logger.info('Token verificado', { tokenPresent: !!token, tokenLength: token ? token.length : 0 });
      
      if (!token) {
        logger.warn('No token found, skipping API calls');
        setMessage('⚠️ Faça login para acessar o dashboard.');
        setLoading(false);
        return;
      }
      
      // Carregar dados do usuário - só se estiver autenticado e com token
      if (isAuthenticated && user && token) {
        logger.info('Loading user data with token', { userEmail: user.email });
        const userInfo = await userService.getUser();
        logger.info('User data loaded successfully', { userInfo });
        setUserData(userInfo);
      } else {
        logger.warn('User not authenticated or no token, skipping getUser call', { 
          isAuthenticated, 
          hasUser: !!user, 
          hasToken: !!token 
        });
        setMessage('⚠️ Faça login para acessar o dashboard.');
        setLoading(false);
        return;
      }

      // Carregar templates
      const templatesData = await templateService.getTemplates();
      setTemplates(templatesData);

      // Gerar atividades
      generateActivities(templatesData);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setMessage('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const generateActivities = (templates: Template[]) => {
    const newActivities: string[] = [];
    
    // Adicionar login sempre como primeira atividade
    newActivities.push('Login realizado com sucesso');

    if (!templates || templates.length === 0) {
      newActivities.push('Nenhum formulário cadastrado ainda');
      newActivities.push('Use o painel para cadastrar seus primeiros formulários');
      setActivities(newActivities);
      return;
    }

    // Ordenar templates por data de criação (mais recentes primeiro)
    const templatesOrdenados = templates
      .filter((template) => template.dataCriacao)
      .sort((a, b) => {
        const dataA = new Date(a.dataCriacao!);
        const dataB = new Date(b.dataCriacao!);
        return dataB.getTime() - dataA.getTime();
      });

    // Gerar atividades baseadas nos templates mais recentes
    const templatesRelevantes = templatesOrdenados.slice(0, 3);

    templatesRelevantes.forEach((template) => {
      if (template.dataCriacao) {
        const dataTemplate = new Date(template.dataCriacao);
        const agora = new Date();
        const diffHoras = Math.floor(
          (agora.getTime() - dataTemplate.getTime()) / (1000 * 60 * 60),
        );

        let tempoAtras = '';
        if (diffHoras < 1) {
          tempoAtras = 'agora mesmo';
        } else if (diffHoras < 24) {
          tempoAtras = `há ${diffHoras} horas`;
        } else {
          const diffDias = Math.floor(diffHoras / 24);
          tempoAtras = `há ${diffDias} dias`;
        }

        newActivities.push(
          `Formulário "${template.nome}" criado ${tempoAtras}`,
        );
      }
    });

    // Adicionar atividades baseadas no uso real
    const templatesComUso = templates.filter(template => (template.totalUso || 0) > 0);
    if (templatesComUso.length > 0) {
      const templateMaisUsado = templatesComUso.sort((a, b) => (b.totalUso || 0) - (a.totalUso || 0))[0];
      newActivities.push(
        `Formulário "${templateMaisUsado.nome}" mais usado: ${templateMaisUsado.totalUso} preenchimentos`
      );
    }

    // Adicionar estatísticas reais
    const totalCampos = templates.reduce((total, template) => {
      return total + (template.campos?.length || 0);
    }, 0);

    if (totalCampos > 0) {
      newActivities.push(`Total de ${totalCampos} campos em ${templates.length} formulários`);
    }

    // Adicionar atividade de sucesso baseada em dados reais
    if (templates.length >= 5) {
      newActivities.push(`Excelente! Você criou ${templates.length} formulários`);
    } else if (templates.length >= 3) {
      newActivities.push(`Bom trabalho! ${templates.length} formulários criados`);
    } else if (templates.length >= 1) {
      newActivities.push(`Começando bem! Seu primeiro formulário foi criado`);
    }

    setActivities(newActivities);
  };

  const calculateGrowthTemplates = (): string => {
    if (totalTemplates === 0) return '';

    if (totalTemplates >= 10) return '+25%';
    if (totalTemplates >= 5) return '+15%';
    if (totalTemplates >= 3) return '+10%';
    if (totalTemplates >= 1) return '+5%';

    return '';
  };

  const calculateGrowthPreenchimentos = (): string => {
    if (formulariosPreenchidos === 0) return '';

    if (formulariosPreenchidos >= 50) return '+20%';
    if (formulariosPreenchidos >= 25) return '+15%';
    if (formulariosPreenchidos >= 10) return '+10%';
    if (formulariosPreenchidos >= 5) return '+8%';

    return '';
  };

  const canAccessUploadCsv = (): boolean => {
    const planoUsuario = userData?.plano?.toUpperCase() || 'PESSOAL';

    return planoUsuario === 'EMPRESARIAL' ||
      planoUsuario.includes('EMPRESARIAL') ||
      planoUsuario === 'PROFISSIONAL_VITALICIO' ||
      planoUsuario.includes('VITALICIO') ||
      planoUsuario === 'PROFISSIONAL_MENSAL' ||
      planoUsuario.includes('MENSAL');
  };

  const getPlanoInfo = () => {
    const plano = userData?.plano || 'PESSOAL';
    
    const planos = {
      'PESSOAL': { nome: 'Pessoal', descricao: 'Ideal para uso pessoal' },
      'PROFISSIONAL': { nome: 'Profissional', descricao: 'Para profissionais' },
      'PROFISSIONAL_MENSAL': { nome: 'Profissional Mensal', descricao: 'Profissional com cobrança mensal' },
      'PROFISSIONAL_VITALICIO': { nome: 'Profissional Vitalício', descricao: 'Profissional vitalício' },
      'EMPRESARIAL': { nome: 'Empresarial', descricao: 'Para empresas' }
    };

    return planos[plano as keyof typeof planos] || planos.PESSOAL;
  };

  const getPlanoLimits = () => {
    const plano = userData?.plano || 'PESSOAL';
    
    const limites = {
      'PESSOAL': { templates: 5, campos: 50 },
      'PROFISSIONAL': { templates: 20, campos: 200 },
      'PROFISSIONAL_MENSAL': { templates: 20, campos: 200 },
      'PROFISSIONAL_VITALICIO': { templates: 20, campos: 200 },
      'EMPRESARIAL': { templates: 100, campos: 1000 }
    };

    return limites[plano as keyof typeof limites] || limites.PESSOAL;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">Você precisa fazer login para acessar o dashboard.</p>
          <Link 
            href="/login" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Carregando Dashboard</h3>
            <p className="text-gray-500">Aguarde enquanto preparamos suas informações...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const planoInfo = getPlanoInfo();
  const planoLimits = getPlanoLimits();

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4">
          {/* Boas-vindas e Resumo */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Bem-vindo ao seu Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Gerencie Seus Formulários e acompanhe suas atividades de preenchimento automático.
            </p>
          </div>

          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Total de Templates */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-gray-300 transition-colors duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="9"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Formulários</h3>
                </div>
                {totalTemplates > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {calculateGrowthTemplates()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-gray-900">{totalTemplates}</span>
              </div>
              <p className="text-xs text-gray-500">Criados manualmente ou via CSV</p>
            </div>

            {/* Formulários Preenchidos */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-gray-300 transition-colors duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Preenchimentos</h3>
                </div>
                {formulariosPreenchidos > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {calculateGrowthPreenchimentos()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-gray-900">{formulariosPreenchidos}</span>
              </div>
              <p className="text-xs text-gray-500">Último: {ultimoPreenchimento}</p>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Ações Rápidas
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Gerenciar Templates */}
              <Link href="/formularios" className="group block">
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                  <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-indigo-200 transition-colors duration-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="9"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Formulários</h3>
                  <p className="text-xs text-gray-500">Crie e organize Seus Formulários</p>
                </div>
              </Link>

              {/* Upload CSV */}
              {canAccessUploadCsv() && (
                <Link href="/upload-csv" className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 p-3 text-center hover:border-green-300 hover:shadow-md transition-all duration-200">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors duration-200">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="12" y2="12"></line>
                        <line x1="15" y1="15" x2="12" y2="12"></line>
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Upload CSV</h3>
                    <p className="text-xs text-gray-500">Importe templates em lote</p>
                  </div>
                </Link>
              )}

              {/* Perfil */}
              <Link href="/perfil" className="group block">
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors duration-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Perfil</h3>
                  <p className="text-xs text-gray-500">Atualize suas informações</p>
                </div>
              </Link>

              {/* Suporte */}
              <Link href="/contato" className="group block">
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center hover:border-orange-300 hover:shadow-md transition-all duration-200">
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-200 transition-colors duration-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                      <path d="M14 9V5a3 3 0 0 0-6 0v4"></path>
                      <rect x="2" y="9" width="20" height="12" rx="2" ry="2"></rect>
                      <circle cx="12" cy="15" r="1"></circle>
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Suporte</h3>
                  <p className="text-xs text-gray-500">Entre em contato conosco</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Seus Formulários */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Seus Formulários
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Formulário Completo - Teste FormSync */}
              <div className="bg-white rounded-xl border border-gray-200 p-3 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="9"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Teste</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Formulário Completo</h3>
                <p className="text-xs text-gray-600 mb-2">Teste todos os tipos de campo com a extensão FormSync</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{totalTemplates + 1} formulários</span>
                  <Link 
                    href="/formularios/formulario-completo" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                  >
                    Testar
                  </Link>
                </div>
              </div>

              {/* Template Padrão (se existir) */}
              {totalTemplates > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-3 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="9"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Ativo</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Seus Formulários</h3>
                  <p className="text-xs text-gray-600 mb-2">Gerencie todos os seus formulários criados</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{totalTemplates} templates</span>
                    <Link 
                      href="/formularios" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                    >
                      Ver Todos
                    </Link>
                  </div>
                </div>
              )}

              {/* Card de Criação */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 hover:border-green-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="12" y2="12"></line>
                      <line x1="15" y1="15" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Novo</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Criar Formulário</h3>
                <p className="text-xs text-gray-600 mb-2">Crie um novo formulário personalizado</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Personalizado</span>
                  <Link 
                    href="/formularios" 
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                  >
                    Criar
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {message && (
            <section className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="text-blue-500 mr-4 text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span className="text-blue-700 font-semibold text-base">{message}</span>
                </div>
              </div>
            </section>
          )}

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl border border-gray-200 mb-4 sm:mb-6">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="m-0 text-base font-bold text-gray-800 flex items-center">
                    <svg className="mr-2 text-purple-500 text-lg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                      <path d="M12 7v5l4 2"></path>
                    </svg>
                    Atividades Recentes
                  </h2>
                  <p className="mt-2 text-gray-600 text-sm">
                    Acompanhe suas últimas ações no sistema
                  </p>
                </div>
                <button
                  onClick={loadDashboardData}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 p-2"
                >
                  <svg className="text-gray-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M12 7v5l-4 2"></path>
                  </svg>
                </button>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div>
                {activities.length > 0 ? (
                  <div>
                    {activities.map((atividade, index) => (
                      <div key={index} className="flex items-center mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="flex-1 text-gray-800">{atividade}</span>
                        <span className="text-gray-500 text-xs">
                          {index === 0 ? 'Agora' : 
                           index === 1 ? '2 min atrás' : 
                           index === 2 ? '5 min atrás' : '10 min atrás'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="text-gray-400 text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                    </div>
                    <h3 className="m-0 mb-2 text-base font-medium text-gray-600">
                      Nenhuma atividade recente
                    </h3>
                    <p className="m-0 text-gray-500">
                      Comece a usar a extensão para ver suas atividades aqui
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações do Plano Atual */}
          <section className="mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl rounded-3xl border border-green-400">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4 text-xl backdrop-blur-sm">
                    🎉
                  </div>
                  <div className="flex-1">
                    <h2 className="m-0 mb-2 text-base font-bold text-white">
                      {planoInfo.nome} Ativo!
                    </h2>
                    <p className="m-0 opacity-90 text-sm text-white">
                      {planoInfo.descricao}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className="bg-white text-green-600 border border-white px-3 py-1.5 text-sm font-semibold rounded-full flex items-center">
                    <svg className="text-green-600 mr-2 w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"></path>
                      <path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"></path>
                    </svg>
                    {planoLimits.templates} formulários
                  </div>
                  <div className="bg-white text-green-600 border border-white px-3 py-1.5 text-sm font-semibold rounded-full flex items-center">
                    <svg className="text-green-600 mr-2 w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    {planoLimits.campos} campos total
                  </div>
                </div>
              </div>
            </div>
          </section>
      </div>
    </DashboardLayout>
  );
}