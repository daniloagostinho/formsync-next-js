'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Logo + Description Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-blue-600">FormSync</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Automatize formulários em qualquer site com templates personalizados. 
                Economize horas todos os dias com 100% de precisão.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/formsync"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Produto Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-6">Produto</h4>
            <nav className="space-y-4">
              <Link href="/" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Funcionalidades
              </Link>
              <Link href="/registrar" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Preços
              </Link>
            </nav>
          </div>

          {/* Suporte Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-6">Suporte</h4>
            <nav className="space-y-4">
              <Link href="/faq" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Perguntas Frequentes
              </Link>
              <Link href="/contato" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Central de ajuda
              </Link>
              <Link href="/contato" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Contato
              </Link>
              <a href="https://wa.me/5511947033324" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                WhatsApp
              </a>
            </nav>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-6">Legal</h4>
            <nav className="space-y-4">
              <Link href="/termos" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Termos de uso
              </Link>
              <Link href="/privacidade" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Privacidade
              </Link>
              <Link href="/cookies" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Cookies
              </Link>
            </nav>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-start gap-2">
              <p className="text-gray-500 text-xs">
                © 2024 FormSync. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  BETA
                </span>
                <span className="text-gray-400 text-xs">Versão em desenvolvimento</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/termos" className="text-gray-500 text-xs hover:text-indigo-600 transition-colors duration-200">
                Termos
              </Link>
              <Link href="/privacidade" className="text-gray-500 text-xs hover:text-indigo-600 transition-colors duration-200">
                Privacidade
              </Link>
              <Link href="/cookies" className="text-gray-500 text-xs hover:text-indigo-600 transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

