'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [planoUsuario, setPlanoUsuario] = useState<'PESSOAL' | 'PROFISSIONAL' | 'PROFISSIONAL_MENSAL' | 'PROFISSIONAL_VITALICIO' | 'EMPRESARIAL'>('PESSOAL');

  useEffect(() => {
    const planoSalvo = localStorage.getItem('plano');
    
    if (!planoSalvo) {
      setPlanoUsuario('PESSOAL');
      return;
    }

    // Converter para maiúsculas para comparação consistente
    const planoUpper = planoSalvo.toUpperCase();

    if (planoUpper === 'EMPRESARIAL' || planoUpper.includes('EMPRESARIAL')) {
      setPlanoUsuario('EMPRESARIAL');
    } else if (planoUpper === 'PROFISSIONAL_VITALICIO' || planoUpper.includes('VITALICIO')) {
      setPlanoUsuario('PROFISSIONAL_VITALICIO');
    } else if (planoUpper === 'PROFISSIONAL_MENSAL' || planoUpper.includes('MENSAL')) {
      setPlanoUsuario('PROFISSIONAL_MENSAL');
    } else if (planoUpper.includes('PROFISSIONAL')) {
      setPlanoUsuario('PROFISSIONAL');
    } else {
      setPlanoUsuario('PESSOAL');
    }
  }, []);

  const podeAcessarUploadCsv = (): boolean => {
    return planoUsuario === 'EMPRESARIAL' ||
      planoUsuario === 'PROFISSIONAL_MENSAL' ||
      planoUsuario === 'PROFISSIONAL_VITALICIO';
  };

  const podeAcessarAnalytics = (): boolean => {
    return planoUsuario === 'EMPRESARIAL' ||
      planoUsuario === 'PROFISSIONAL_MENSAL' ||
      planoUsuario === 'PROFISSIONAL_VITALICIO' ||
      planoUsuario === 'PROFISSIONAL';
  };

  const podeAcessarCalculadoraPlanos = (): boolean => {
    return true; // Todos os usuários podem acessar
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      show: true
    },
    {
      href: '/formularios',
      label: 'Formulários',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      ),
      show: true
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
        </svg>
      ),
      show: podeAcessarAnalytics()
    },
    {
      href: '/upload-csv',
      label: 'Importar CSV',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="12" y2="12"></line>
          <line x1="15" y1="15" x2="12" y2="12"></line>
        </svg>
      ),
      show: podeAcessarUploadCsv()
    },
    {
      href: '/perfil',
      label: 'Perfil',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      show: true
    }
  ];

  const SidebarContent = () => (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col" role="complementary" aria-label="Menu lateral" id="sidebar">
      <div className="flex flex-col h-full sidebar-min-h-screen">
        {/* Menu de navegação */}
        <nav className="flex-1 p-4" role="navigation" aria-label="Menu principal">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navegação</h2>
            <div className="space-y-2">
              {menuItems.map((item) => {
                if (!item.show) return null;
                
                const active = isActive(item.href);
                
                return (
                  <div key={item.href} className="group">
                    <Link 
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-200 hover:bg-gray-50 hover:border-gray-200 group-hover:shadow-sm ${
                        active 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'border-transparent text-gray-700 hover:text-blue-700'
                      }`}
                      aria-label={`Ir para ${item.label}`}
                    >
                      <span className={`transition-colors duration-200 ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}>
                        {item.icon}
                      </span>
                      <span className={`font-medium transition-colors duration-200 text-sm ${active ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-700'}`}>
                        {item.label}
                      </span>
                      <div className={`ml-auto w-2 h-2 bg-blue-500 rounded-full transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={onClose}>
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <aside
            className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4" role="navigation" aria-label="Menu principal mobile">
                <div className="mb-6">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navegação</h2>
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      if (!item.show) return null;
                      
                      const active = isActive(item.href);
                      
                      return (
                        <div key={item.href} className="group">
                          <Link 
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-200 hover:bg-gray-50 hover:border-gray-200 group-hover:shadow-sm ${
                              active 
                                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                : 'border-transparent text-gray-700 hover:text-blue-700'
                            }`}
                            aria-label={`Ir para ${item.label}`}
                          >
                            <span className={`transition-colors duration-200 ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}>
                              {item.icon}
                            </span>
                            <span className={`font-medium transition-colors duration-200 text-sm ${active ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-700'}`}>
                              {item.label}
                            </span>
                            <div className={`ml-auto w-2 h-2 bg-blue-500 rounded-full transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
