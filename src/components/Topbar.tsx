'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { templateService, Template, CampoTemplate } from '@/services/templateService';
import SearchResultItem from './SearchResultItem';

const Topbar: React.FC = React.memo(() => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Template[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await templateService.listarTemplates();
      const templates = response.data || [];
      
      // Filtrar templates que correspondem ao termo de busca
      const filteredResults = templates.filter((template: Template) =>
        matchesSearchTerm(template, term)
      ).slice(0, 10); // Limitar a 10 resultados

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Search term matching function - memoized
  const matchesSearchTerm = useCallback((template: Template, term: string): boolean => {
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
    if (template.campos?.some((campo: CampoTemplate) =>
      campo.nome?.toLowerCase().includes(lowerTerm) ||
      campo.valor?.toLowerCase().includes(lowerTerm)
    )) {
      return true;
    }

    return false;
  }, []);

  // Highlight search matches - memoized
  const highlightMatch = useCallback((text: string, term: string): string => {
    if (!text || !term) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  }, []);

  // Handle search input - memoized
  const handleSearchInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setSelectedIndex(-1);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (term.trim()) {
      setShowSearchResults(true);
      // Debounce search
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(term.trim());
      }, 300);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  }, [performSearch]);

  // Handle search focus - memoized
  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
    if (searchTerm.trim()) {
      setShowSearchResults(true);
    }
  }, [searchTerm]);

  // Handle search blur - memoized
  const handleSearchBlur = useCallback(() => {
    // Delay para permitir cliques nos resultados
    setTimeout(() => {
      setSearchFocused(false);
      setShowSearchResults(false);
    }, 200);
  }, []);

  // Handle search keydown - memoized
  const handleSearchKeydown = useCallback((event: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          selectTemplate(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        clearSearch();
        break;
    }
  }, [showSearchResults, searchResults, selectedIndex]);

  // Select template - memoized
  const selectTemplate = useCallback((template: Template) => {
    router.push(`/templates?selected=${template.id}`);
    clearSearch();
  }, [router]);

  // Clear search - memoized
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSelectedIndex(-1);
    setSearchLoading(false);
  }, []);

  // Create new template - memoized
  const criarNovoTemplate = useCallback(() => {
    router.push('/formularios');
  }, [router]);

  // Toggle mobile menu - memoized
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Format user name - memoized
  const formatarNome = useCallback((nome: string): string => {
    if (!nome) return '';

    // Remove espaços extras e quebra em partes
    const partes = nome.trim().split(' ').filter(parte => parte.length > 0);

    if (partes.length === 0) return '';

    // Se tem apenas uma parte, retorna ela
    if (partes.length === 1) return partes[0];

    // Se tem duas ou mais partes, retorna apenas o primeiro nome
    return partes[0];
  }, []);

  // Memoized user name
  const nomeUsuario = useMemo(() => formatarNome(user?.nome || ''), [user?.nome, formatarNome]);

  // Handle document click to close search
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchContainer = searchContainerRef.current;

      if (searchContainer && !searchContainer.contains(target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
          <div className="flex items-center gap-3">
              {/* Pesquisa Global */}
              <div className="hidden md:flex relative" ref={searchContainerRef}>
                <div className={`flex items-center bg-gray-50 rounded-lg px-2 py-1 min-w-48 border-2 transition-colors duration-200 ${
                  searchFocused ? 'border-indigo-500 bg-white shadow-lg' : 'border-transparent'
                }`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                       className={`mr-2 transition-colors duration-200 ${
                         searchFocused ? 'text-indigo-500' : 'text-gray-400'
                       }`}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input 
                    ref={searchInputRef}
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
                        
                        {searchResults.map((template, index) => (
                          <SearchResultItem
                            key={template.id}
                            template={template}
                            searchTerm={searchTerm}
                            isSelected={selectedIndex === index}
                            onSelect={selectTemplate}
                            onMouseEnter={() => setSelectedIndex(index)}
                            highlightMatch={highlightMatch}
                          />
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

          {/* Área do Usuário (direita) */}
          <div className="flex items-center gap-2">
            {/* Menu do Usuário */}
            <div className="flex items-center gap-2">
              {/* Info do Usuário (desktop) */}
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">
                      <span className="text-sm font-normal text-gray-900">Bem vindo,</span> {nomeUsuario}!
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

            {/* Menu Mobile */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Menu"
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
});

Topbar.displayName = 'Topbar';

export default Topbar;
