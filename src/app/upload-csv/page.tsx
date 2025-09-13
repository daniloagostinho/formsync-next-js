'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function UploadCsvPage() {
  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload CSV</h1>
          <p className="text-gray-600">Importe templates em lote via arquivo CSV</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Página de Upload CSV</h3>
            <p className="text-gray-600 mb-6">Esta página será implementada em breve com a funcionalidade completa de upload e importação de arquivos CSV.</p>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Selecionar Arquivo
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
