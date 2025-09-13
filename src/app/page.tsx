'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Página de boas-vindas para usuários não logados */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <img src="/formsync-logo.svg" alt="FormSync Logo" className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FormSync</h1>
              <p className="text-gray-600">Automatize o preenchimento de formulários</p>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/login"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Fazer Login
              </Link>
              <Link 
                href="/registrar"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* O Topbar só aparece aqui quando o usuário estiver logado */}
      <div className="pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              FormSync - Dashboard
            </h1>
            <p className="text-gray-600 mb-6">
              Bem-vindo ao FormSync! O componente Topbar está funcionando no topo da página.
            </p>
            
            {/* Exemplo de conteúdo que seria exibido abaixo do Topbar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Formulários</h3>
                <p className="text-blue-700 text-sm">Gerencie seus formulários</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Templates</h3>
                <p className="text-green-700 text-sm">Use os templates prontos</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Relatórios</h3>
                <p className="text-purple-700 text-sm">Acompanhe o uso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}