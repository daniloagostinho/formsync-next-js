import { useState, useCallback, useMemo } from 'react';
import { templateService, Template } from '@/services/templateService';

interface UseSearchOptions {
  debounceMs?: number;
  maxResults?: number;
}

interface UseSearchReturn {
  searchTerm: string;
  searchResults: Template[];
  searchLoading: boolean;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  performSearch: (term: string) => Promise<void>;
}

/**
 * Hook customizado para busca otimizada
 * Inclui debounce, cache e otimizações de performance
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 300, maxResults = 10 } = options;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Template[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchCache, setSearchCache] = useState<Map<string, Template[]>>(new Map());

  // Função para verificar se um template corresponde ao termo de busca
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
    if (template.campos?.some((campo) =>
      campo.nome?.toLowerCase().includes(lowerTerm) ||
      campo.valor?.toLowerCase().includes(lowerTerm)
    )) {
      return true;
    }

    return false;
  }, []);

  // Função para realizar a busca
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    // Verificar cache primeiro
    const cachedResults = searchCache.get(term);
    if (cachedResults) {
      setSearchResults(cachedResults);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await templateService.listarTemplates();
      const templates = response.data || [];
      
      // Filtrar templates que correspondem ao termo de busca
      const filteredResults = templates
        .filter((template: Template) => matchesSearchTerm(template, term))
        .slice(0, maxResults);

      // Atualizar cache
      setSearchCache(prev => new Map(prev).set(term, filteredResults));
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [matchesSearchTerm, maxResults, searchCache]);

  // Função para limpar a busca
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchLoading(false);
  }, []);

  // Debounced search term
  const debouncedSearchTerm = useMemo(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm.trim());
      } else {
        setSearchResults([]);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs, performSearch]);

  // Limpar timer quando o componente desmontar
  useMemo(() => {
    return () => {
      if (debouncedSearchTerm) {
        debouncedSearchTerm();
      }
    };
  }, [debouncedSearchTerm]);

  return {
    searchTerm,
    searchResults,
    searchLoading,
    setSearchTerm,
    clearSearch,
    performSearch
  };
}
