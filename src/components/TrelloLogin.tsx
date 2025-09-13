'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/auth';

interface LoginFormData {
  email: string;
}

interface LoginFormErrors {
  email?: string;
}

const TrelloLogin: React.FC = () => {
  const router = useRouter();
  const { loginWithCredentials, isLoading: authLoading } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({ email: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [mensagemErro, setMensagemErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [senha, setSenha] = useState('');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Validador customizado para o campo email
  const emailValidator = (email: string): string | null => {
    if (!email) return 'E-mail é obrigatório';

    // Verifica se há espaços no início ou fim
    if (email.trim() !== email) {
      return 'Formato de e-mail inválido';
    }

    // Verifica se contém múltiplos emails (separados por vírgula, ponto e vírgula, etc.)
    if (email.includes(',') || email.includes(';') || email.includes('|')) {
      return 'Não é permitido múltiplos e-mails';
    }

    // Regex básico para formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'Formato de e-mail inválido';
    }

    // Verifica se o domínio é válido (pelo menos 2 caracteres após o ponto)
    const domainPart = email.split('@')[1];
    const domainSections = domainPart?.split('.');
    if (!domainPart || !domainSections || !domainSections[1] || domainSections[1].length < 2) {
      return 'Domínio de e-mail inválido';
    }

    // Verifica se é um email internacional (domínios de país com mais de 2 caracteres)
    const countryDomains = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'int'];
    const domainParts = domainPart.split('.');
    const topLevelDomain = domainParts[domainParts.length - 1];

    if (topLevelDomain && topLevelDomain.length > 3 && !countryDomains.includes(topLevelDomain)) {
      return 'E-mail internacional não suportado';
    }

    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    
    const emailError = emailValidator(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 [TRELLO_LOGIN] Iniciando processo de login...');
    console.log('   - Email:', formData.email);

    if (!validateForm()) {
      setMensagemErro('Por favor, corrija os erros no formulário.');
      return;
    }

    setCarregando(true);
    setMensagemErro('');

    try {
      // Para simplificar, vamos fazer login direto com email e senha
      // Em uma implementação mais complexa, você poderia ter um fluxo de verificação por email
      
      if (!senha) {
        setMensagemErro('Por favor, digite sua senha.');
        setCarregando(false);
        return;
      }

      // Fazer login real com o backend
      await loginWithCredentials(formData.email, senha);
      
      // Sucesso - redirecionar para dashboard
      router.push('/dashboard');
      
    } catch (error: unknown) {
      console.error('❌ [TRELLO_LOGIN] Erro ao fazer login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.';
      setMensagemErro(errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
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

      {/* Hero Section com Formulário de Login - Estilo Trello */}
      <section className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-6xl">
          {/* Layout Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Conteúdo da Esquerda - Alinhado com a logo */}
            <div className="text-center lg:text-left lg:pl-4">
              {/* Header Principal */}
              <h1 className="text-5xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight mt-[100px]">
                Bem-vindo de volta
              </h1>
              
              {/* Subheading */}
              <p className="text-xl mb-8 text-gray-600 leading-relaxed">
                Acesse sua conta e continue automatizando formulários em qualquer site
              </p>
              
              {/* Benefícios */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Seus Formulários salvos</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Sincronização automática</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">100% seguro</span>
                </div>
              </div>
            </div>

            {/* Card de Login - Alinhado com o botão "Começar por R$ 14,90/mês" */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 lg:pr-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Entrar</h2>
                <p className="text-gray-600">Entre com seu email para continuar</p>
              </div>

              {/* Mensagem de erro */}
              {mensagemErro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <span className="text-red-800 text-sm font-medium">{mensagemErro}</span>
                  </div>
                </div>
              )}

              {/* Formulário de login */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Digite seu e-mail" 
                    autoComplete="email"
                    className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {/* Mensagem de erro para email */}
                  {errors.email && (
                    <div className="mt-2 text-sm text-red-600">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Campo Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                  <input 
                    type="password" 
                    name="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha" 
                    autoComplete="current-password"
                    className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 border-gray-300"
                  />
                </div>

                {/* CTA Principal */}
                <button
                  type="submit"
                  disabled={!formData.email || !senha || carregando || authLoading}
                  className="w-full py-4 px-6 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {(carregando || authLoading) && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {!(carregando || authLoading) && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                  )}
                  {(carregando || authLoading) ? 'Fazendo login...' : 'Entrar'}
                </button>

                {/* Link secundário */}
                <div className="text-center">
                  <Link href="/registrar" className="text-gray-600 font-medium hover:text-gray-900 transition-colors duration-200">
                    Não tem conta? Criar conta gratuita →
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TrelloLogin;
