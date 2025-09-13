'use client';

import { useState } from 'react';
import { templateService } from '@/services/templateService';

export const useApiTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testTemplatesApi = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing templates API...');
      const templates = await templateService.listarTemplates();
      console.log('✅ Templates API success:', templates);
      setResult({ success: true, data: templates });
    } catch (err: any) {
      console.error('❌ Templates API error:', err);
      setError(err.message || 'Erro desconhecido');
      setResult({ success: false, error: err.response?.data || err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthStatus = () => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('auth_token');
    const cookies = document.cookie;
    
    return {
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : null,
      cookies: cookies,
      timestamp: new Date().toISOString()
    };
  };

  return {
    testTemplatesApi,
    testAuthStatus,
    isLoading,
    result,
    error
  };
};

