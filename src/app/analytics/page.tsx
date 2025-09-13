'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Visualize estatísticas e relatórios detalhados</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Página de Analytics</h3>
            <p className="text-gray-600 mb-6">Esta página será implementada em breve com gráficos e relatórios detalhados sobre o uso dos formulários.</p>
            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Ver Relatórios
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
