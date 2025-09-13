'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import PublicHeader from '@/components/PublicHeader';
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
  const [senha, setSenha] = useState('');

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
      <PublicHeader />

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
