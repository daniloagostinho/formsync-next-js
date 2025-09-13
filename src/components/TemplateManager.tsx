'use client';

import React, { useState, useEffect } from 'react';
import { Template, Campo, TipoCampo, SimpleTemplate } from '@/types';
import { templateService } from '@/services/templateService';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { AuthDebug } from './AuthDebug';
import '@/styles/template-manager.css';

interface TemplateFormData {
  nome: string;
  descricao: string;
  campos: Campo[];
}

export const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [carregandoPagina, setCarregandoPagina] = useState(true);
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState<TemplateFormData>({
    nome: '',
    descricao: '',
    campos: [{ nome: '', valor: '', tipo: 'text', ordem: 1 }]
  });

  // Confirmação de exclusão
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    templateName: string;
    templateId: number;
  }>({ isOpen: false, templateName: '', templateId: 0 });

  // Tipos de campo disponíveis
  const tiposCampo: TipoCampo[] = [
    { value: 'text', label: 'Texto' },
    { value: 'email', label: 'E-mail' },
    { value: 'password', label: 'Senha' },
    { value: 'number', label: 'Número' },
    { value: 'tel', label: 'Telefone' },
    { value: 'url', label: 'URL' },
    { value: 'cpf', label: 'CPF' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'cep', label: 'CEP' },
    { value: 'currency', label: 'Moeda' },
    { value: 'date', label: 'Data' },
    { value: 'time', label: 'Horário' },
    { value: 'datetime-local', label: 'Data e Hora' },
    { value: 'textarea', label: 'Área de Texto' },
    { value: 'select', label: 'Seleção' },
    { value: 'checkbox', label: 'Caixa de Seleção' },
    { value: 'radio', label: 'Botão de Opção' },
    { value: 'hidden', label: 'Campo Oculto' },
    { value: 'file', label: 'Arquivo' },
    { value: 'color', label: 'Cor' },
    { value: 'range', label: 'Intervalo' },
    { value: 'search', label: 'Pesquisa' }
  ];

  useEffect(() => {
    carregarTemplates();
  }, []);

  const carregarTemplates = async () => {
    setCarregandoPagina(true);
    try {
      const templatesData = await templateService.listarTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      setErrorMessage('Erro ao carregar templates');
    } finally {
      setCarregandoPagina(false);
    }
  };

  const editarTemplate = (template: Template) => {
    setIsEditing(true);
    setEditingTemplateId(template.id || null);
    setFormData({
      nome: template.nome,
      descricao: template.descricao || '',
      campos: template.campos
    });
    setActiveTab(0);
  };

  const duplicarTemplate = async (template: Template) => {
    setLoading(true);
    try {
      const templateDuplicado: SimpleTemplate = {
        nome: `${template.nome} (Cópia)`,
        descricao: template.descricao,
        campos: template.campos.map(campo => ({
          nome: campo.nome,
          valor: campo.valor,
          tipo: campo.tipo,
          ordem: campo.ordem
        })),
        dataCriacao: new Date().toISOString()
      };

      await templateService.criarTemplate(templateDuplicado);
      await carregarTemplates();
      setErrorMessage('');
    } catch (error) {
      console.error('Erro ao duplicar template:', error);
      setErrorMessage('Erro ao duplicar template');
    } finally {
      setLoading(false);
    }
  };

  const removerTemplate = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setDeleteDialog({
      isOpen: true,
      templateName: template.nome,
      templateId: templateId
    });
  };

  const confirmarExclusao = async () => {
    try {
      await templateService.deletarTemplate(deleteDialog.templateId);
      await carregarTemplates();
      setDeleteDialog({ isOpen: false, templateName: '', templateId: 0 });
      setErrorMessage('');
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      setErrorMessage('Erro ao excluir template');
    }
  };

  const updateCampo = (index: number, field: keyof Campo, value: string) => {
    const newCampos = [...formData.campos];
    newCampos[index] = { ...newCampos[index], [field]: value };
    setFormData({ ...formData, campos: newCampos });
  };

  const adicionarCampo = () => {
    const newCampo: Campo = {
      nome: '',
      valor: '',
      tipo: 'text',
      ordem: formData.campos.length + 1
    };
    setFormData({ ...formData, campos: [...formData.campos, newCampo] });
  };

  const removerCampo = (index: number) => {
    if (formData.campos.length <= 1) return;
    const newCampos = formData.campos.filter((_, i) => i !== index);
    // Reordena os campos
    const reorderedCampos = newCampos.map((campo, i) => ({ ...campo, ordem: i + 1 }));
    setFormData({ ...formData, campos: reorderedCampos });
  };

  const moverCampoParaCima = (index: number) => {
    if (index === 0) return;
    const newCampos = [...formData.campos];
    [newCampos[index], newCampos[index - 1]] = [newCampos[index - 1], newCampos[index]];
    // Reordena
    const reorderedCampos = newCampos.map((campo, i) => ({ ...campo, ordem: i + 1 }));
    setFormData({ ...formData, campos: reorderedCampos });
  };

  const moverCampoParaBaixo = (index: number) => {
    if (index === formData.campos.length - 1) return;
    const newCampos = [...formData.campos];
    [newCampos[index], newCampos[index + 1]] = [newCampos[index + 1], newCampos[index]];
    // Reordena
    const reorderedCampos = newCampos.map((campo, i) => ({ ...campo, ordem: i + 1 }));
    setFormData({ ...formData, campos: reorderedCampos });
  };

  const getPlaceholder = (tipo: string): string => {
    const placeholders: { [key: string]: string } = {
      'text': 'Digite o texto',
      'email': 'exemplo@email.com',
      'password': '••••••••',
      'number': '123456',
      'tel': '(11) 99999-9999',
      'url': 'https://exemplo.com',
      'cpf': '000.000.000-00',
      'cnpj': '00.000.000/0000-00',
      'cep': '00000-000',
      'currency': 'R$ 1.000,00',
      'date': '01/01/2024',
      'time': '14:30',
      'datetime-local': '01/01/2024 14:30',
      'textarea': 'Digite o texto longo',
      'select': 'opcao1,opcao2,opcao3 (separadas por vírgula)',
      'checkbox': 'true, false, sim, não, etc.',
      'radio': 'opcao1,opcao2,opcao3 (separadas por vírgula)',
      'hidden': 'Valor oculto',
      'file': 'Selecione um arquivo',
      'color': '#000000',
      'range': '0-100',
      'search': 'Digite para pesquisar'
    };
    return placeholders[tipo] || 'Digite o valor';
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      campos: [{ nome: '', valor: '', tipo: 'text', ordem: 1 }]
    });
    setIsEditing(false);
    setEditingTemplateId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const templateData: SimpleTemplate = {
        nome: formData.nome,
        descricao: formData.descricao,
        campos: formData.campos,
        dataCriacao: new Date().toISOString()
      };

      if (isEditing && editingTemplateId) {
        await templateService.atualizarTemplate(editingTemplateId, templateData);
      } else {
        await templateService.criarTemplate(templateData);
      }

      await carregarTemplates();
      resetForm();
      setActiveTab(1); // Vai para a aba de templates
      setErrorMessage('');
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      setErrorMessage('Erro ao salvar template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg font-bold text-gray-900 mb-1">
              Gerenciador de Formulários
            </h1>
            <p className="text-sm text-gray-600">
              Crie e gerencie Formulários personalizados para automatizar o preenchimento de formulários.
            </p>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-red-700 text-sm">{errorMessage}</span>
                <button onClick={() => setErrorMessage('')} className="text-red-500 hover:text-red-700">
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="mb-4 sm:mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8">
                <button
                  onClick={() => {
                    setActiveTab(0);
                    if (!isEditing) resetForm();
                  }}
                  className={`whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 text-center ${
                    activeTab === 0 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Criar Formulário
                </button>
                <button
                  onClick={() => setActiveTab(1)}
                  className={`whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 text-center ${
                    activeTab === 1 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Meus Formulários
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      {isEditing ? 'Editar Formulário' : 'Criar Formulário'}
                    </h2>
                    <p className="text-gray-500 text-xs">
                      {isEditing ? 'Modifique os dados do Formulário' : 'Defina um nome e adicione campos personalizados'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nome do Template */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Formulário *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: Catho, InfoJobs, LinkedIn"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição (opcional)
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      placeholder="Descreva para que serve este Formulário"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Campos */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Campos do Formulário</h3>
                    <div className="space-y-4">
                      {formData.campos.map((campo, index) => (
                        <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors duration-200">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-medium text-gray-700">Campo {index + 1}</span>
                            <div className="flex items-center gap-1">
                              {index > 0 && (
                                <button type="button" onClick={() => moverCampoParaCima(index)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                              )}
                              {index < formData.campos.length - 1 && (
                                <button type="button" onClick={() => moverCampoParaBaixo(index)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              )}
                              {formData.campos.length > 1 && (
                                <button type="button" onClick={() => removerCampo(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Nome do Campo *</label>
                              <input
                                type="text"
                                value={campo.nome}
                                onChange={(e) => updateCampo(index, 'nome', e.target.value)}
                                placeholder="Ex: email, senha, nome"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                              <select
                                value={campo.tipo}
                                onChange={(e) => updateCampo(index, 'tipo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              >
                                {tiposCampo.map((tipo) => (
                                  <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Valor *</label>
                              {campo.tipo === 'textarea' ? (
                                <textarea
                                  value={campo.valor}
                                  onChange={(e) => updateCampo(index, 'valor', e.target.value)}
                                  placeholder={getPlaceholder(campo.tipo)}
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                                  required
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={campo.valor}
                                  onChange={(e) => updateCampo(index, 'valor', e.target.value)}
                                  placeholder={getPlaceholder(campo.tipo)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                  required
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-right">
                      <button
                        type="button"
                        onClick={adicionarCampo}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 border border-indigo-600 hover:border-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Adicionar Campo
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>{loading ? 'Salvando...' : (isEditing ? 'Atualizar Template' : 'Criar Formulário')}</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M9 12h6"></path>
                      <path d="M9 16h6"></path>
                      <path d="M5 8h4"></path>
                      <path d="M5 12h4"></path>
                      <path d="M5 16h4"></path>
                      <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      Seus Formulários
                      {templates.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {templates.length}
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-500 text-xs">Gerencie todos os Seus Formulários criados</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {carregandoPagina ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-200">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">Você ainda não criou nenhum Template</h3>
                    <p className="text-gray-500 mb-4 text-sm">
                      Comece criando seu primeiro Template personalizado para automatizar o preenchimento de formulários
                    </p>
                    <button
                      onClick={() => setActiveTab(0)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-medium rounded-lg transition-all duration-200 border border-purple-600 hover:border-purple-700 flex items-center justify-center space-x-2 mx-auto text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Criar Primeiro Template</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {templates.map((template) => (
                      <div key={template.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all duration-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-sm font-semibold text-gray-800">{template.nome}</h3>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200">
                                {template.campos.length || 0} campos
                              </span>
                            </div>
                            {template.descricao && (
                              <p className="text-gray-600 mb-2 text-xs">{template.descricao}</p>
                            )}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {template.campos.map((campo, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
                                  {campo.nome}: {campo.valor}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-3">
                            <button
                              onClick={() => editarTemplate(template)}
                              disabled={loading}
                              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Editar Template"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => duplicarTemplate(template)}
                              disabled={loading}
                              className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Duplicar Template"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removerTemplate(template.id!)}
                              disabled={loading}
                              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remover Template"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
      </div>

      {/* Dialog de confirmação */}
      <ConfirmDeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, templateName: '', templateId: 0 })}
        onConfirm={confirmarExclusao}
        data={{ templateName: deleteDialog.templateName, templateId: deleteDialog.templateId }}
      />

      {/* Debug component */}
      <AuthDebug />
    </div>
  );
};
