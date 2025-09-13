'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';

const PublicHeader: React.FC = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-[60] h-16 md:h-16 h-20 border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-blue-600">FormSync</h3>
          </Link>
        </div>

        {/* Desktop CTA Buttons - Hidden on mobile */}
        <div className="hidden md:flex gap-3 lg:gap-4 items-center">
          <Link href="/login" className="text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-2.5 transition-colors text-base min-h-[44px] flex items-center">
            Entrar
          </Link>
          <Link href="/registrar" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 text-base min-h-[48px] flex items-center shadow-lg hover:shadow-xl">
            Começar por R$ 14,90/mês
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="Abrir menu de navegação"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {!mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-md z-[55] border-t border-gray-200/50 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="px-4 py-6 space-y-4">
            <a href="#features" className="block text-gray-700 font-semibold hover:text-indigo-600 transition-colors text-lg py-3 px-4 rounded-lg hover:bg-gray-50 min-h-[48px] flex items-center" onClick={closeMobileMenu}>
              Features
            </a>
            <a href="#plans" className="block text-gray-700 font-semibold hover:text-indigo-600 transition-colors text-lg py-3 px-4 rounded-lg hover:bg-gray-50 min-h-[48px] flex items-center" onClick={closeMobileMenu}>
              Planos
            </a>
            <a href="#testimonials" className="block text-gray-700 font-semibold hover:text-indigo-600 transition-colors text-lg py-3 px-4 rounded-lg hover:bg-gray-50 min-h-[48px] flex items-center" onClick={closeMobileMenu}>
              Depoimentos
            </a>

            <div className="pt-4 space-y-3">
              <Link href="/login" className="block text-gray-700 font-semibold hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-3 transition-colors text-lg min-h-[48px] flex items-center" onClick={closeMobileMenu}>
                Entrar
              </Link>
              <Link href="/registrar" className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-4 py-4 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 text-lg min-h-[52px] flex items-center justify-center shadow-lg" onClick={closeMobileMenu}>
                Começar por R$ 14,90/mês
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
});

PublicHeader.displayName = 'PublicHeader';

export default PublicHeader;
