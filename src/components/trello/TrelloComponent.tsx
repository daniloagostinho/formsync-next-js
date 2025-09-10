'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  UseCase, 
  Plan, 
  Testimonial, 
  Stat, 
  Feature, 
  HowItWorks 
} from '@/types/trello';

const TrelloComponent: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const onSignUp = () => {
    if (email) {
      console.log('Sign up with email:', email);
    }
  };

  // Data arrays
  const features: Feature[] = [
    {
      title: 'Painel de Formulários',
      description: 'Aqui você cadastra seus dados uma única vez e cria formulários personalizados para cada site que usa. Design limpo e premium, muito fácil de usar.',
      icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2',
      color: 'indigo'
    },
    {
      title: 'Extensão',
      description: 'Instale no Chrome ou Firefox e ela vai preencher automaticamente qualquer formulário usando os dados que você cadastrou no painel.',
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      color: 'blue'
    },
    {
      title: 'Automação Inteligente',
      description: 'Preenchimento automático em qualquer site com inteligência artificial que reconhece campos e preenche com precisão seus dados cadastrados.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'yellow'
    }
  ];

  const plans: Plan[] = [
    {
      name: 'Pessoal',
      description: '5 formulários diferentes',
      price: 'R$ 14,90',
      period: '/mês',
      features: [
        'Ideal para quem preenche poucos formulários na internet',
        'Até 150 campos no total',
        'App desktop completo',
        'Suporte por email'
      ],
      badge: 'Pessoal',
      buttonText: 'Começar Pessoal',
      buttonVariant: 'secondary'
    },
    {
      name: 'Profissional',
      description: '50 formulários diferentes',
      price: 'R$ 39,90',
      period: 'por mês',
      features: [
        'Ideal para profissionais que preenchem muitos formulários',
        'Até 1000 campos no total',
        'Relatórios de uso e importação CSV',
        'Suporte prioritário'
      ],
      popular: true,
      buttonText: 'Começar Agora',
      buttonVariant: 'primary'
    },
    {
      name: 'Empresarial',
      description: '200 formulários diferentes',
      price: 'R$ 149,90',
      period: '/mês',
      features: [
        'Para equipes de RH, vendas, marketing que preenchem centenas de formulários',
        'Até 5000 campos no total',
        'Gestão para equipes',
        'Relatórios empresariais',
        'Importação em lote',
        'Suporte 24/7 + Telefone'
      ],
      badge: 'Empresarial',
      buttonText: 'Falar com Especialista',
      buttonVariant: 'accent'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-[60] h-16 md:h-20 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl sm:text-2xl cursor-pointer font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
              FormSync
            </Link>
          </div>

          <div className="hidden md:flex gap-3 lg:gap-4 items-center">
            <Link href="/login" className="text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-2.5 transition-colors text-base min-h-[44px] flex items-center">
              Entrar
            </Link>
            <Link href="/registrar" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 text-base min-h-[48px] flex items-center shadow-lg hover:shadow-xl">
              Começar por R$ 14,90/mês
            </Link>
          </div>

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

        {mobileMenuOpen && (
          <>
            <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]" onClick={closeMobileMenu}></div>
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
          </>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-4 sm:left-10 w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50"></div>
          <div className="absolute top-40 right-4 sm:right-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse shadow-lg shadow-indigo-600/50" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/10 to-purple-500/20"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 leading-[0.9] mt-10 sm:mt-10 text-white" style={{fontFamily: 'Inter, Poppins, sans-serif'}}>
            Automatize formulários<br />
            <span className="text-white">em qualquer site</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-10 sm:mb-16 max-w-4xl mx-auto leading-relaxed px-4 text-slate-300" style={{fontFamily: 'Inter, sans-serif', fontWeight: 400}}>
            A ferramenta definitiva para profissionais que valorizam tempo e precisão.<br className="hidden sm:block" />
            <span className="text-white font-semibold">RH, Marketing, Vendas, Desenvolvimento</span>
            —
            <span className="text-indigo-400 font-semibold">todos se beneficiam</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
            <Link href="/registrar?plano=PESSOAL" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg sm:text-xl rounded-full transition-all duration-300 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 w-full sm:w-auto min-h-[56px] border border-indigo-500/20">
              <span>Começar Agora</span>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </Link>

            <button className="group flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-400 text-slate-300 rounded-full hover:bg-slate-800/50 hover:border-slate-300 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto min-h-[56px] bg-slate-800/30">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700/50 rounded-full flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-semibold text-base sm:text-lg">Ver Demonstração</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8 lg:mb-10 text-gray-800">
            O que é o FormSync?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 sm:p-10 lg:p-12 rounded-2xl hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 bg-white border-2 border-gray-100 shadow-lg hover:border-indigo-200 hover:shadow-indigo-100/50">
                <div className={`w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-${feature.color}-100 to-${feature.color === 'indigo' ? 'purple' : feature.color === 'blue' ? 'cyan' : 'orange'}-100 rounded-3xl flex items-center justify-center shadow-lg border border-${feature.color}-200`}>
                  <svg className={`w-8 h-8 sm:w-9 sm:h-9 text-${feature.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path>
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                  {feature.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="plans" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8 lg:mb-10 text-gray-800">
            Escolha quantos formulários você pode automatizar
          </h3>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 lg:mb-16 text-base sm:text-lg">
            Comece com o plano que faz sentido para sua profissão e faça upgrade quando precisar
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
            {plans.map((plan, index) => (
              <div key={index} className={`border-2 rounded-2xl p-6 sm:p-8 lg:p-10 hover:-translate-y-2 transition-all duration-300 bg-white shadow-lg hover:shadow-2xl ${
                plan.popular 
                  ? 'border-indigo-300 hover:border-indigo-500 relative bg-gradient-to-br from-indigo-50 to-white hover:shadow-indigo-200/50' 
                  : 'border-gray-200 hover:border-indigo-400 hover:shadow-indigo-100/50'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg border border-indigo-500">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6 sm:mb-8">
                  {plan.badge && (
                    <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-gray-200">
                      {plan.badge}
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
                    {plan.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className={`text-3xl sm:text-4xl font-bold ${plan.popular ? 'text-indigo-600' : 'text-gray-800'}`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-600 text-sm sm:text-base">{plan.period}</span>
                  </div>
                </div>

                <hr className={`my-6 sm:my-8 ${plan.popular ? 'border-indigo-200' : 'border-gray-200'}`} />

                <div className="mb-6 sm:mb-8">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm sm:text-base text-gray-600 relative pl-5 sm:pl-6">
                        <span className={`absolute left-0 font-bold ${plan.popular ? 'text-indigo-500' : 'text-green-500'}`}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/registrar?plano=${plan.name.toUpperCase()}`} className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 text-base sm:text-lg text-center block min-h-[56px] flex items-center justify-center shadow-lg hover:shadow-xl ${
                  plan.buttonVariant === 'primary' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 border border-indigo-500'
                    : plan.buttonVariant === 'accent'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 border border-purple-500'
                    : 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-700'
                }`}>
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a href="#" className="text-blue-600 font-medium text-base hover:underline">Ver todos os planos</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrelloComponent;
