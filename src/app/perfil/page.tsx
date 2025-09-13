'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function PerfilPage() {
  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Página de Perfil</h3>
            <p className="text-gray-600 mb-6">Esta página será implementada em breve com a funcionalidade completa de gerenciamento de perfil.</p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar Perfil
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
