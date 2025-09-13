'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/auth';

interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  lgpdConsent: boolean;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
  lgpdConsent?: string;
}

export default function TrelloRegister() {
  const router = useRouter();
  const { register, isLoading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showLgpdModal, setShowLgpdModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    lgpdConsent: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({ score: 0, label: '', color: '' });
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Função para calcular a força da senha
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSpaces: !/\s/.test(password),
      noConsecutive: !/(.)\1{2,}/.test(password)
    };

    // Contar critérios atendidos
    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    // Determinar label e cor baseado no score
    let label = '';
    let color = '';

    if (score <= 2) {
      label = 'Muito fraca';
      color = 'bg-red-500';
    } else if (score <= 4) {
      label = 'Fraca';
      color = 'bg-orange-500';
    } else if (score <= 5) {
      label = 'Média';
      color = 'bg-yellow-500';
    } else if (score <= 6) {
      label = 'Forte';
      color = 'bg-blue-500';
    } else {
      label = 'Muito forte';
      color = 'bg-green-500';
    }

    setPasswordStrength({ score, label, color });
  };

  // Validação de email personalizada (baseada no Angular)
  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email é obrigatório';
    
    const trimmedEmail = email.trim();
    if (trimmedEmail !== email) return 'Email não pode ter espaços no início ou fim';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return 'Email inválido';
    
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) return 'Email deve ter apenas um @';
    
    const [localPart, domain] = parts;
    if (!localPart || !domain) return 'Email inválido';
    
    if (localPart.includes('..')) return 'Email não pode ter pontos consecutivos';
    
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return 'Email deve ter domínio válido';
    
    return null;
  };

  // Validação de nome personalizada
  const validateNome = (nome: string): string | null => {
    if (!nome) return 'Nome é obrigatório';
    
    const trimmedNome = nome.trim();
    if (trimmedNome !== nome) return 'Nome não pode ter espaços no início ou fim';
    
    if (trimmedNome.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
    
    if (trimmedNome.length > 100) return 'Nome deve ter no máximo 100 caracteres';
    
    const nomeRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nomeRegex.test(trimmedNome)) return 'Nome deve conter apenas letras e espaços';
    
    return null;
  };

  // Validação de senha personalizada
  const validateSenha = (senha: string): string | null => {
    if (!senha) return 'Senha é obrigatória';
    
    if (senha.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
    
    if (senha.length > 50) return 'Senha deve ter no máximo 50 caracteres';
    
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasLowerCase = /[a-z]/.test(senha);
    const hasNumbers = /\d/.test(senha);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    
    if (!hasUpperCase) return 'Senha deve ter pelo menos uma letra maiúscula';
    if (!hasLowerCase) return 'Senha deve ter pelo menos uma letra minúscula';
    if (!hasNumbers) return 'Senha deve ter pelo menos um número';
    if (!hasSpecialChar) return 'Senha deve ter pelo menos um caractere especial';
    
    // Verificar padrões sequenciais
    const sequentialPatterns = [
      /123456/,
      /234567/,
      /345678/,
      /456789/,
      /567890/,
      /abcdef/,
      /bcdefg/,
      /cdefgh/,
      /defghi/,
      /efghij/,
      /fghijk/,
      /ghijkl/,
      /hijklm/,
      /ijklmn/,
      /jklmno/,
      /klmnop/,
      /lmnopq/,
      /mnopqr/,
      /nopqrs/,
      /opqrst/,
      /pqrstu/,
      /qrstuv/,
      /rstuvw/,
      /stuvwx/,
      /tuvwxy/,
      /uvwxyz/
    ];
    
    for (const pattern of sequentialPatterns) {
      if (pattern.test(senha.toLowerCase())) {
        return 'Senha sequencial não permitida (ex: 123456, abcdef)';
      }
    }
    
    // Verificar senhas comuns
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
      'master', 'hello', 'freedom', 'whatever', 'qazwsx', 'trustno1'
    ];
    
    if (commonPasswords.includes(senha.toLowerCase())) {
      return 'Senha muito comum, escolha uma mais segura';
    }
    
    return null;
  };

  // Validação de confirmação de senha
  const validateConfirmarSenha = (senha: string, confirmarSenha: string): string | null => {
    if (!confirmarSenha) return 'Confirmação de senha é obrigatória';
    
    if (senha !== confirmarSenha) return 'Senhas não coincidem';
    
    return null;
  };

  // Função para validar todo o formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const nomeError = validateNome(formData.nome);
    if (nomeError) newErrors.nome = nomeError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const senhaError = validateSenha(formData.senha);
    if (senhaError) newErrors.senha = senhaError;
    
    const confirmarSenhaError = validateConfirmarSenha(formData.senha, formData.confirmarSenha);
    if (confirmarSenhaError) newErrors.confirmarSenha = confirmarSenhaError;
    
    if (!formData.lgpdConsent) {
      newErrors.lgpdConsent = 'Você deve aceitar os termos de uso e política de privacidade';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpar mensagens anteriores
    setMensagemErro('');
    setMensagemSucesso('');
    
    if (!validateForm()) {
      setMensagemErro('Por favor, corrija os erros no formulário.');
      return;
    }

    // Verificar consentimento LGPD obrigatório
    if (!formData.lgpdConsent) {
      setMensagemErro('É necessário aceitar a política de privacidade para continuar.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Preparar dados para o backend
      const userData = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
        plano: 'FREE', // Plano padrão
        consentimentoLGPD: formData.lgpdConsent,
        consentimentoMarketing: false, // Por enquanto sempre false
        consentimentoAnalytics: false, // Por enquanto sempre false
      };

      // Fazer requisição real para o backend
      await register(userData);
      
      // Sucesso
      setMensagemSucesso('Conta criada com sucesso! Redirecionando...');
      
      // Redirecionar após um pequeno delay para mostrar a mensagem
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error: unknown) {
      console.error('Erro ao criar conta:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao criar conta. Tente novamente.';
      setMensagemErro(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <PublicHeader />
      
      {/* Hero Section com Formulário de Cadastro - Estilo Trello */}
      <section className="py-16 bg-white text-gray-900 flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-6xl">
          {/* Layout Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Conteúdo da Esquerda - Alinhado com a logo */}
            <div className="text-center lg:text-left lg:pl-4">
              {/* Header Principal */}
              <h1 className="text-5xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight -mt-[250px]">
                Crie sua conta
              </h1>
              
              {/* Subheading */}
              <p className="text-xl mb-8 text-gray-600 leading-relaxed">
                Comece gratuitamente em segundos e automatize qualquer formulário na internet
              </p>
              
              {/* Benefícios */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Automatize qualquer formulário</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Disponível em todas as plataformas</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">100% de precisão</span>
                </div>
              </div>
            </div>

            {/* Card de Cadastro - Alinhado com o botão "Começar por R$ 14,90/mês" */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 lg:pr-4 mt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar conta</h2>
                <p className="text-gray-600">Preencha seus dados para começar</p>
              </div>

              {/* Mensagens de Status */}
              {mensagemErro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <span className="text-red-800 text-sm font-medium">{mensagemErro}</span>
                  </div>
                </div>
              )}

              {mensagemSucesso && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-green-800 text-sm font-medium">{mensagemSucesso}</span>
                  </div>
                </div>
              )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite seu nome" 
                  className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.nome && <div className="mt-2 text-sm text-red-600">{errors.nome}</div>}
              </div>

              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Digite seu e-mail" 
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <div className="mt-2 text-sm text-red-600">{errors.email}</div>}
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <input 
                    type={hidePassword ? 'password' : 'text'}
                    value={formData.senha}
                    onChange={(e) => {
                      setFormData({ ...formData, senha: e.target.value });
                      calculatePasswordStrength(e.target.value);
                    }}
                    placeholder="Crie uma senha forte" 
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 ${errors.senha ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setHidePassword(!hidePassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {hidePassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Indicador de Força da Senha */}
                {formData.senha && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Força da senha:</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <div 
                            key={i}
                            className={`w-3 h-2 rounded-full transition-colors duration-200 ${
                              i <= (passwordStrength.score / 7) * 5 ? passwordStrength.color : 'bg-gray-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-600' :
                        passwordStrength.score <= 4 ? 'text-orange-600' :
                        passwordStrength.score <= 5 ? 'text-yellow-600' :
                        passwordStrength.score <= 6 ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    
                    {/* Requisitos da Senha */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-1 ${formData.senha.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={formData.senha.length >= 8 ? 'text-green-600' : 'text-gray-400'}>●</span>
                        Mín. 8 caracteres
                      </div>
                      <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.senha) ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={/[A-Z]/.test(formData.senha) ? 'text-green-600' : 'text-gray-400'}>●</span>
                        Uma maiúscula
                      </div>
                      <div className={`flex items-center gap-1 ${/\d/.test(formData.senha) ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={/\d/.test(formData.senha) ? 'text-green-600' : 'text-gray-400'}>●</span>
                        Um número
                      </div>
                      <div className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.senha) ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.senha) ? 'text-green-600' : 'text-gray-400'}>●</span>
                        Um especial
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.senha && <div className="mt-2 text-sm text-red-600">{errors.senha}</div>}
              </div>

              {/* Campo Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                <div className="relative">
                  <input 
                    type={hideConfirmPassword ? 'password' : 'text'}
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    placeholder="Confirme sua senha" 
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 ${errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setHideConfirmPassword(!hideConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {hideConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmarSenha && <div className="mt-2 text-sm text-red-600">{errors.confirmarSenha}</div>}
              </div>

              {/* Consentimento LGPD - Botão para Modal */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">Consentimento LGPD</h4>
                    <p className="text-sm text-blue-700">Aceite nossa política de privacidade para continuar</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${formData.lgpdConsent ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.lgpdConsent ? 'Aceito' : 'Pendente'}
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowLgpdModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {formData.lgpdConsent ? 'Alterar Consentimento' : 'Gerencie sua Privacidade Para Continuar'}
                </button>
                {errors.lgpdConsent && <p className="text-red-500 text-sm mt-1">{errors.lgpdConsent}</p>}
              </div>

              {/* CTA Principal */}
              <button
                type="submit"
                disabled={isLoading || authLoading || !formData.lgpdConsent}
                className="w-full py-4 px-6 bg-indigo-600 text-white font-semibold text-lg rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {(isLoading || authLoading) ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-7a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                )}
                {(isLoading || authLoading) ? 'Criando conta...' : 'Criar conta'}
              </button>

              {/* Link secundário */}
              <div className="text-center">
                <Link href="/login" className="text-gray-600 font-medium hover:text-gray-900 transition-colors duration-200">
                  Já tem conta? Entrar →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    {/* Modal LGPD */}
    {showLgpdModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowLgpdModal(false)}>
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          
          {/* Header do Modal */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Consentimento LGPD</h2>
                <p className="text-sm text-gray-600">Gerencie suas preferências de privacidade</p>
              </div>
            </div>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setShowLgpdModal(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Conteúdo do Modal */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-4">
              {/* Política de Privacidade (Obrigatório) */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="modalPoliticaPrivacidade"
                    checked={formData.lgpdConsent}
                    onChange={(e) => setFormData({ ...formData, lgpdConsent: e.target.checked })}
                    className="mt-1 w-5 h-5 text-red-600 bg-white border-2 border-red-300 rounded focus:ring-red-500 focus:ring-2"
                    required
                  />
                  <label htmlFor="modalPoliticaPrivacidade" className="flex-1 text-sm text-red-800 leading-relaxed">
                    <span className="font-semibold">Política de Privacidade</span> 
                    <span className="text-red-600 font-bold">*</span>
                    <br />
                    <span className="text-red-700">Li e aceito a coleta e uso dos meus dados pessoais conforme descrito na política de privacidade. Este consentimento é obrigatório para criar sua conta.</span>
                  </label>
                </div>
              </div>

              {/* Marketing (Opcional) */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="modalMarketing"
                    className="mt-1 w-5 h-5 text-green-600 bg-white border-2 border-green-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <label htmlFor="modalMarketing" className="flex-1 text-sm text-green-800 leading-relaxed">
                    <span className="font-semibold">Marketing e Comunicações</span>
                    <span className="text-green-600 text-xs ml-1">(Opcional)</span>
                    <br />
                    <span className="text-green-700">Aceito receber e-mails sobre novos recursos, atualizações e ofertas especiais do FormSync.</span>
                  </label>
                </div>
              </div>

              {/* Cookies (Opcional) */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="modalCookies"
                    className="mt-1 w-5 h-5 text-blue-600 bg-white border-2 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="modalCookies" className="flex-1 text-sm text-blue-800 leading-relaxed">
                    <span className="font-semibold">Cookies e Analytics</span>
                    <span className="text-blue-600 text-xs ml-1">(Opcional)</span>
                    <br />
                    <span className="text-blue-700">Aceito o uso de cookies para melhorar a experiência e analisar o uso do serviço.</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer do Modal */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowLgpdModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={() => setShowLgpdModal(false)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
