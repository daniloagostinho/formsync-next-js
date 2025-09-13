'use client';

import React from 'react';
import { Template } from '@/services/templateService';

interface SearchResultItemProps {
  template: Template;
  searchTerm: string;
  isSelected: boolean;
  onSelect: (template: Template) => void;
  onMouseEnter: () => void;
  highlightMatch: (text: string, term: string) => string;
}

const SearchResultItem: React.FC<SearchResultItemProps> = React.memo(({
  template,
  searchTerm,
  isSelected,
  onSelect,
  onMouseEnter,
  highlightMatch
}) => {
  const handleClick = () => {
    onSelect(template);
  };

  const handleMouseEnter = () => {
    onMouseEnter();
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`px-3 py-2 cursor-pointer transition-colors duration-200 border-b border-gray-50 last:border-b-0 ${
        isSelected ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'
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
              template.totalUso > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
            {template.campos?.slice(0, 3).map((campo) => (
              <span 
                key={campo.id}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700"
              >
                {campo.nome}
              </span>
            ))}
            {template.campos?.length > 3 && (
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
  );
});

SearchResultItem.displayName = 'SearchResultItem';

export default SearchResultItem;
