'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

const VerificarCodigoPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [codigo, setCodigo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Se não há email, redirecionar para login
      router.push('/login');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      setMensagemErro('Por favor, digite o código de verificação.');
      return;
    }

    setCarregando(true);
    setMensagemErro('');

    try {
      // Simular verificação do código (em produção, chamaria a API)
      console.log('🔐 [VERIFICAR_CODIGO] Verificando código...');
      console.log('   - Email:', email);
      console.log('   - Código:', codigo);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em produção, aqui faria a chamada para a API
      // const response = await fetch('/api/auth/verify-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, codigo })
      // });

      // Por enquanto, simular sucesso e redirecionar para dashboard
      console.log('✅ [VERIFICAR_CODIGO] Código verificado com sucesso');
      router.push('/dashboard');
      
    } catch (error) {
      console.error('❌ [VERIFICAR_CODIGO] Erro na verificação:', error);
      setMensagemErro('Código inválido. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const reenviarCodigo = async () => {
    setCarregando(true);
    setMensagemErro('');

    try {
      console.log('📧 [REENVIAR_CODIGO] Reenviando código para:', email);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em produção, aqui faria a chamada para a API
      // const response = await fetch('/api/auth/send-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      console.log('✅ [REENVIAR_CODIGO] Código reenviado com sucesso');
      setMensagemErro('Código reenviado! Verifique seu email.');
      
    } catch (error) {
      console.error('❌ [REENVIAR_CODIGO] Erro ao reenviar:', error);
      setMensagemErro('Erro ao reenviar código. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section com Formulário de Verificação */}
      <section className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          {/* Layout Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Conteúdo da Esquerda */}
            <div className="text-center lg:text-left lg:pl-4">
              {/* Header Principal */}
              <h1 className="text-5xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight mt-[100px]">
                Verifique seu email
              </h1>
              
              {/* Subheading */}
              <p className="text-xl mb-8 text-gray-600 leading-relaxed">
                Enviamos um código de verificação para <strong>{email}</strong>
              </p>
              
              {/* Instruções */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Verifique sua caixa de entrada</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">O código expira em 10 minutos</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Verifique também a pasta de spam</span>
                </div>
              </div>
            </div>

            {/* Card de Verificação */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 lg:pr-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Digite o código</h2>
                <p className="text-gray-600">Insira o código de 6 dígitos que enviamos</p>
              </div>

              {/* Mensagem de erro */}
              {mensagemErro && (
                <div className={`mb-6 p-4 rounded-lg ${
                  mensagemErro.includes('reenviado') 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <svg className={`w-5 h-5 flex-shrink-0 ${
                      mensagemErro.includes('reenviado') ? 'text-green-600' : 'text-red-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {mensagemErro.includes('reenviado') ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      )}
                    </svg>
                    <span className="text-sm font-medium">{mensagemErro}</span>
                  </div>
                </div>
              )}

              {/* Formulário de verificação */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Código */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código de verificação</label>
                  <input 
                    type="text" 
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000" 
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 text-center text-2xl tracking-widest"
                  />
                </div>

                {/* CTA Principal */}
                <button
                  type="submit"
                  disabled={codigo.length !== 6 || carregando}
                  className="w-full py-4 px-6 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {carregando && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {!carregando && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  )}
                  {carregando ? 'Verificando...' : 'Verificar código'}
                </button>

                {/* Link para reenviar */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={reenviarCodigo}
                    disabled={carregando}
                    className="text-gray-600 font-medium hover:text-gray-900 transition-colors duration-200 disabled:opacity-50"
                  >
                    Não recebeu? Reenviar código
                  </button>
                </div>

                {/* Link para voltar */}
                <div className="text-center">
                  <Link href="/login" className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200">
                    ← Voltar para login
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

export default VerificarCodigoPage;
