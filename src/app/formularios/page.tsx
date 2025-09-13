'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function FormulariosPage() {
  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Formulários</h1>
          <p className="text-gray-600">Gerencie seus formulários e templates</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Página de Formulários</h3>
            <p className="text-gray-600 mb-6">Esta página será implementada em breve com a funcionalidade completa de gerenciamento de formulários.</p>
            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Criar Novo Formulário
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
