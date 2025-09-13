'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { templateService } from '@/services/templateService';

interface Template {
  id: string;
  nome: string;
  descricao?: string;
  campos?: Array<{ nome: string; valor: string }>;
  totalUso?: number;
  ultimoUso?: string;
  dataCriacao?: string;
}

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export default function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Estados da busca
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Template[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [plano, setPlano] = useState('PESSOAL');

  useEffect(() => {
    // Carregar plano do localStorage
    const planoSalvo = localStorage.getItem('plano');
    if (planoSalvo) {
      setPlano(planoSalvo);
    }
  }, []);

  useEffect(() => {
    // Configurar busca com debounce
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm.trim());
      } else {
        setSearchResults([]);
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    // Fechar busca ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    try {
      const templates = await templateService.getTemplates();
      const filteredTemplates = templates.filter(template =>
        matchesSearchTerm(template, term)
      ).slice(0, 10); // Limitar a 10 resultados

      setSearchResults(filteredTemplates);
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const matchesSearchTerm = (template: Template, term: string): boolean => {
    const lowerTerm = term.toLowerCase();

    // Buscar no nome
    if (template.nome?.toLowerCase().includes(lowerTerm)) {
      return true;
    }

    // Buscar na descrição
    if (template.descricao?.toLowerCase().includes(lowerTerm)) {
      return true;
    }

    // Buscar nos campos
    if (template.campos?.some((campo) =>
      campo.nome?.toLowerCase().includes(lowerTerm) ||
      campo.valor?.toLowerCase().includes(lowerTerm)
    )) {
      return true;
    }

    return false;
  };

  const highlightMatch = (text: string, term: string): string => {
    if (!text || !term) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  const selectTemplate = (template: Template) => {
    router.push(`/templates?selected=${template.id}`);
    clearSearch();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSelectedIndex(-1);
    setSearchLoading(false);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSelectedIndex(-1);

    if (term.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (searchTerm.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay para permitir cliques nos resultados
    setTimeout(() => {
      setSearchFocused(false);
      setShowSearchResults(false);
    }, 200);
  };

  const handleSearchKeydown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, searchResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          selectTemplate(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        clearSearch();
        break;
    }
  };

  const criarNovoTemplate = () => {
    router.push('/formularios');
  };

  const getInitials = (nome: string): string => {
    if (!nome) return 'U';

    const partes = nome.trim().split(' ').filter(parte => parte.length > 0);

    if (partes.length === 0) return 'U';
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();

    // Pega primeira letra do primeiro e último nome
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  };

  const formatarNome = (nome: string): string => {
    if (!nome) return '';

    // Remove espaços extras e quebra em partes
    const partes = nome.trim().split(' ').filter(parte => parte.length > 0);

    if (partes.length === 0) return '';

    // Se tem apenas uma parte, retorna ela
    if (partes.length === 1) return partes[0];

    // Se tem duas ou mais partes, retorna apenas o primeiro nome
    return partes[0];
  };

  return (
    <>
      {/* Topbar Moderna para Área Logada */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14">
        <div className="flex items-center justify-between h-full px-3">
          
          {/* Logo Compacto (esquerda) - Padrão dashboard/área logada */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
              <img src="/formsync-logo.svg" alt="FormSync Logo" className="w-8 h-8" />
              <span className="text-xl sm:text-1xl font-black text-blue-600">FormSync</span>
            </Link>
          </div>

          {/* Ações Centrais (centro) */}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              {/* Pesquisa Global */}
              <div className="hidden md:flex relative" ref={searchRef}>
                <div className={`flex items-center bg-gray-50 rounded-lg px-2 py-1 min-w-48 border-2 transition-colors duration-200 ${
                  searchFocused ? 'border-indigo-500 bg-white shadow-lg' : 'border-transparent'
                }`}>
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={`mr-2 transition-colors duration-200 ${
                      searchFocused ? 'text-indigo-500' : 'text-gray-400'
                    }`}
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Buscar Formulários..." 
                    value={searchTerm}
                    onChange={handleSearchInput}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyDown={handleSearchKeydown}
                    className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
                    autoComplete="off"
                  />
                  <kbd className={`hidden lg:inline-block px-1.5 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded border border-gray-200 transition-opacity duration-200 ${
                    searchTerm ? 'opacity-0' : 'opacity-100'
                  }`}>
                    ⌘K
                  </kbd>
                  
                  {/* Loading spinner */}
                  {searchLoading && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin text-indigo-500 ml-2">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}

                  {/* Clear button */}
                  {searchTerm && !searchLoading && (
                    <button 
                      onClick={clearSearch}
                      className="ml-2 p-0.5 hover:bg-gray-200 rounded transition-colors duration-200"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Dropdown de Resultados */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                    
                    {/* Loading State */}
                    {searchLoading && (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-500">Buscando templates...</p>
                      </div>
                    )}

                    {/* Resultados */}
                    {!searchLoading && searchResults.length > 0 && (
                      <div className="py-2">
                        <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                          {searchResults.length} template{searchResults.length > 1 ? 's' : ''} encontrado{searchResults.length > 1 ? 's' : ''}
                        </div>
                        
                        {searchResults.map((template, i) => (
                          <div 
                            key={template.id}
                            onClick={() => selectTemplate(template)}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={`px-3 py-2 cursor-pointer transition-colors duration-200 border-b border-gray-50 last:border-b-0 ${
                              selectedIndex === i ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'
                            }`}
                          >
                            
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                {/* Nome do Formulário */}
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 
                                    className="text-sm font-medium text-gray-900 truncate" 
                                    dangerouslySetInnerHTML={{ __html: highlightMatch(template.nome, searchTerm) }}
                                  ></h4>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    (template.totalUso || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {template.totalUso || 0} uso{(template.totalUso || 0) !== 1 ? 's' : ''}
                                  </span>
                                </div>

                                {/* Descrição */}
                                {template.descricao && (
                                  <p 
                                    className="text-xs text-gray-600 mb-2 line-clamp-1" 
                                    dangerouslySetInnerHTML={{ __html: highlightMatch(template.descricao, searchTerm) }}
                                  ></p>
                                )}

                                {/* Campos Preview */}
                                <div className="flex flex-wrap gap-1">
                                  {template.campos?.slice(0, 3).map((campo, index) => (
                                    <span 
                                      key={index}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700"
                                    >
                                      {campo.nome}
                                    </span>
                                  ))}
                                  {template.campos && template.campos.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                      +{template.campos.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Ícone de Template */}
                              <div className="ml-3 flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="9" y1="9" x2="15" y2="9"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Nenhum Resultado */}
                    {!searchLoading && searchResults.length === 0 && searchTerm && (
                      <div className="p-4 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                          </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Nenhum formulário encontrado</h3>
                        <p className="text-xs text-gray-500 mb-3">Tente buscar por um nome diferente ou crie um Novo Formulário.</p>
                        <button 
                          onClick={criarNovoTemplate} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14"></path>
                            <path d="M5 12h14"></path>
                          </svg>
                          Criar Formulário
                        </button>
                      </div>
                    )}

                    {/* Footer com dicas */}
                    {!searchLoading && searchResults.length > 0 && (
                      <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Use ↑↓ para navegar</span>
                          <span>Enter para selecionar</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botão Criar Novo (Ação Principal) */}
              <button 
                onClick={criarNovoTemplate}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                <span>Novo Formulário</span>
              </button>
            </div>
          )}

          {/* Área do Usuário (direita) */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Info do Usuário (desktop) */}
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    <span className="text-sm font-normal text-gray-900">Bem vindo,</span> {formatarNome(user.nome)}!
                  </span>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-1.5">
                  {/* Botão de Sair */}
                  <button 
                    onClick={logout}
                    className="px-3 py-1.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Ações para usuários não logados */}
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10,17 15,12 10,7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span className="hidden sm:block">Login</span>
                </Link>
                <Link 
                  href="/registrar" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                  </svg>
                  <span className="hidden sm:block">Registrar</span>
                </Link>
              </>
            )}

            {/* Menu Mobile */}
            <button 
              onClick={onToggleMobileMenu} 
              className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200" 
              style={{ zIndex: 9999, position: 'relative' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer para compensar o header fixo */}
      <div className="h-14"></div>
    </>
  );
}