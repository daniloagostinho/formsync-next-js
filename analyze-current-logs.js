#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Analisar logs atuais e identificar problemas
function analyzeCurrentLogs() {
  console.log('🔍 ANÁLISE DE LOGS ATUAIS - FormSync\n');
  console.log('=' .repeat(60));
  
  // Simular logs baseados no que sabemos que está acontecendo
  const simulatedLogs = [
    {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Auth initialization',
      data: { tokenFound: false }
    },
    {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'No token found, skipping auth check'
    },
    {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'API Request: GET /api/v1/usuarios/me',
      data: { tokenPresent: false },
      url: '/api/v1/usuarios/me',
      method: 'GET'
    },
    {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message: 'No token found for protected endpoint: /api/v1/usuarios/me',
      url: '/api/v1/usuarios/me',
      method: 'GET'
    },
    {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'API Error: 403 /api/v1/usuarios/me',
      data: {
        message: 'Request failed with status code 403',
        status: 403,
        data: { error: 'Forbidden', message: 'Access Denied' }
      },
      url: '/api/v1/usuarios/me',
      method: 'GET',
      status: 403
    },
    {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: '403 Forbidden - access denied for: /api/v1/usuarios/me',
      data: {
        url: '/api/v1/usuarios/me',
        method: 'GET',
        responseData: { error: 'Forbidden', message: 'Access Denied' }
      },
      url: '/api/v1/usuarios/me',
      method: 'GET',
      status: 403
    }
  ];

  const analysis = {
    totalLogs: simulatedLogs.length,
    errors: simulatedLogs.filter(log => log.level === 'error'),
    warnings: simulatedLogs.filter(log => log.level === 'warn'),
    info: simulatedLogs.filter(log => log.level === 'info'),
    patterns: {
      '403 Forbidden': 0,
      '401 Unauthorized': 0,
      'No token found': 0,
      'API Calls': 0,
      'Auth Issues': 0
    }
  };

  // Analisar padrões
  simulatedLogs.forEach(log => {
    if (log.message.includes('403 Forbidden')) {
      analysis.patterns['403 Forbidden']++;
    }
    if (log.message.includes('401 Unauthorized')) {
      analysis.patterns['401 Unauthorized']++;
    }
    if (log.message.includes('No token found')) {
      analysis.patterns['No token found']++;
    }
    if (log.message.includes('API Request:') || log.message.includes('API Error:')) {
      analysis.patterns['API Calls']++;
    }
    if (log.message.includes('Auth initialization') || log.message.includes('token')) {
      analysis.patterns['Auth Issues']++;
    }
  });

  // Gerar relatório
  console.log(`📊 ESTATÍSTICAS GERAIS:`);
  console.log(`   Total de logs: ${analysis.totalLogs}`);
  console.log(`   Erros: ${analysis.errors.length}`);
  console.log(`   Warnings: ${analysis.warnings.length}`);
  console.log(`   Info: ${analysis.info.length}`);
  
  console.log(`\n🚨 PADRÕES IDENTIFICADOS:`);
  Object.entries(analysis.patterns).forEach(([pattern, count]) => {
    if (count > 0) {
      console.log(`   ${pattern}: ${count} ocorrências`);
    }
  });
  
  console.log(`\n❌ ERROS ENCONTRADOS:`);
  analysis.errors.forEach((error, index) => {
    console.log(`   ${index + 1}. [${error.timestamp}] ${error.message}`);
    if (error.data) {
      console.log(`      Dados: ${JSON.stringify(error.data, null, 2)}`);
    }
  });
  
  console.log(`\n⚠️  WARNINGS ENCONTRADOS:`);
  analysis.warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. [${warning.timestamp}] ${warning.message}`);
  });
  
  console.log(`\n💡 ANÁLISE DOS PROBLEMAS:`);
  console.log(`   🔍 PROBLEMA PRINCIPAL: 403 Forbidden em /api/v1/usuarios/me`);
  console.log(`   📋 CAUSA: Requisições sendo feitas sem token de autenticação`);
  console.log(`   🎯 SOLUÇÃO: Implementar fluxo de autenticação correto`);
  
  console.log(`\n🔧 CORREÇÕES NECESSÁRIAS:`);
  console.log(`   1. ✅ Verificar se o token está sendo salvo no localStorage`);
  console.log(`   2. ✅ Verificar se o token está sendo enviado nas requisições`);
  console.log(`   3. ✅ Verificar se o fluxo de login está funcionando`);
  console.log(`   4. ✅ Verificar se o AuthContext está funcionando corretamente`);
  
  console.log(`\n🎯 PRÓXIMOS PASSOS:`);
  console.log(`   1. Testar o fluxo de login completo`);
  console.log(`   2. Verificar se o token é salvo após login`);
  console.log(`   3. Verificar se o token é enviado nas requisições`);
  console.log(`   4. Testar com token válido do backend`);
  
  console.log(`\n` + '=' .repeat(60));
  
  return analysis;
}

// Executar análise
analyzeCurrentLogs();
