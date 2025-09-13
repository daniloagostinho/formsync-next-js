'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApiTest } from '@/hooks/useApiTest';

export const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();
  const { testTemplatesApi, testAuthStatus, isLoading, result, error } = useApiTest();
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null);
  const [cookies, setCookies] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalStorageToken(localStorage.getItem('auth_token'));
      setCookies(document.cookie);
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div><strong>isAuthenticated:</strong> {isAuthenticated ? '✅' : '❌'}</div>
        <div><strong>user:</strong> {user ? `${user.name} (${user.email})` : 'null'}</div>
        <div><strong>user ID:</strong> {user?.id || 'null'}</div>
        <div><strong>token (store):</strong> {token ? `${token.substring(0, 20)}...` : 'null'}</div>
        <div><strong>token (localStorage):</strong> {localStorageToken ? `${localStorageToken.substring(0, 20)}...` : 'null'}</div>
        <div><strong>cookies:</strong> {cookies || 'none'}</div>
        
        <div className="mt-3 pt-2 border-t border-gray-600">
          <button 
            onClick={testTemplatesApi}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-2 py-1 rounded text-xs"
          >
            {isLoading ? 'Testing...' : 'Test API'}
          </button>
        </div>
        
        {result && (
          <div className="mt-2">
            <div><strong>API Result:</strong></div>
            <pre className="text-xs bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        {error && (
          <div className="mt-2">
            <div><strong>API Error:</strong></div>
            <div className="text-red-400 text-xs">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};
