'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  url?: string;
  method?: string;
  status?: number;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'debug' | 'api'>('all');

  useEffect(() => {
    // Load existing logs
    setLogs(logger.getAllLogs());
    setIsConnected(true);

    // Set up interval to refresh logs
    const interval = setInterval(() => {
      setLogs(logger.getAllLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const downloadLogs = () => {
    logger.downloadLogs();
  };

  const getFilteredLogs = () => {
    switch (filter) {
      case 'error':
        return logs.filter(log => log.level === 'error');
      case 'warn':
        return logs.filter(log => log.level === 'warn');
      case 'info':
        return logs.filter(log => log.level === 'info');
      case 'debug':
        return logs.filter(log => log.level === 'debug');
      case 'api':
        return logs.filter(log => log.url || log.message.includes('API'));
      default:
        return logs;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'debug': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Logs em Tempo Real</h1>
                <p className="text-gray-600">Monitore logs do frontend em tempo real</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadLogs}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📥 Baixar Logs
                  </button>
                  <button
                    onClick={clearLogs}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    🗑️ Limpar
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Filtrar:</span>
              <div className="flex gap-2">
                {['all', 'error', 'warn', 'info', 'debug', 'api'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType as any)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      filter === filterType
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filterType.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-4 font-mono text-sm">
            {getFilteredLogs().length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Nenhum log ainda. Interaja com a aplicação para ver logs aqui.</p>
                <p className="text-xs mt-2">Acesse outras páginas ou faça login para gerar logs.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {getFilteredLogs().map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    {log.url && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex-shrink-0">
                        {log.method} {log.url}
                      </span>
                    )}
                    {log.status && (
                      <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                        log.status >= 400 ? 'text-red-600 bg-red-50' : 
                        log.status >= 300 ? 'text-yellow-600 bg-yellow-50' : 
                        'text-green-600 bg-green-50'
                      }`}>
                        {log.status}
                      </span>
                    )}
                    <span className="text-gray-800 flex-1 break-words">
                      {log.message}
                    </span>
                    {log.data && (
                      <details className="text-xs text-gray-500">
                        <summary>Data</summary>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total de logs: {logs.length} | Filtrados: {getFilteredLogs().length}</span>
              <span>Última atualização: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
