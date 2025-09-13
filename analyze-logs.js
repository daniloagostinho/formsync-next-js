#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Função para analisar logs e identificar problemas
function analyzeLogs(logContent) {
  const lines = logContent.split('\n');
  const analysis = {
    totalLogs: 0,
    errors: [],
    warnings: [],
    apiErrors: [],
    authIssues: [],
    patterns: {
      '403 Forbidden': 0,
      '401 Unauthorized': 0,
      'Network Error': 0,
      'Token Issues': 0,
      'API Calls': 0
    }
  };

  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    analysis.totalLogs++;
    
    // Detectar erros
    if (line.includes('[ERROR]')) {
      analysis.errors.push({ line: index + 1, content: line });
    }
    
    // Detectar warnings
    if (line.includes('[WARN]')) {
      analysis.warnings.push({ line: index + 1, content: line });
    }
    
    // Detectar problemas específicos
    if (line.includes('403 Forbidden')) {
      analysis.patterns['403 Forbidden']++;
      analysis.apiErrors.push({ line: index + 1, content: line });
    }
    
    if (line.includes('401 Unauthorized')) {
      analysis.patterns['401 Unauthorized']++;
      analysis.authIssues.push({ line: index + 1, content: line });
    }
    
    if (line.includes('Network Error') || line.includes('ECONNREFUSED')) {
      analysis.patterns['Network Error']++;
    }
    
    if (line.includes('No token found') || line.includes('Token not found')) {
      analysis.patterns['Token Issues']++;
    }
    
    if (line.includes('API Request:') || line.includes('API Response:')) {
      analysis.patterns['API Calls']++;
    }
  });

  return analysis;
}

// Função para gerar relatório
function generateReport(analysis) {
  console.log('🔍 ANÁLISE DE LOGS - RELATÓRIO DETALHADO\n');
  console.log('=' .repeat(50));
  
  console.log(`📊 ESTATÍSTICAS GERAIS:`);
  console.log(`   Total de logs: ${analysis.totalLogs}`);
  console.log(`   Erros: ${analysis.errors.length}`);
  console.log(`   Warnings: ${analysis.warnings.length}`);
  console.log(`   Chamadas de API: ${analysis.patterns['API Calls']}`);
  
  console.log(`\n🚨 PADRÕES IDENTIFICADOS:`);
  Object.entries(analysis.patterns).forEach(([pattern, count]) => {
    if (count > 0) {
      console.log(`   ${pattern}: ${count} ocorrências`);
    }
  });
  
  if (analysis.errors.length > 0) {
    console.log(`\n❌ ERROS ENCONTRADOS:`);
    analysis.errors.slice(0, 10).forEach(error => {
      console.log(`   Linha ${error.line}: ${error.content.substring(0, 100)}...`);
    });
    if (analysis.errors.length > 10) {
      console.log(`   ... e mais ${analysis.errors.length - 10} erros`);
    }
  }
  
  if (analysis.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS ENCONTRADOS:`);
    analysis.warnings.slice(0, 5).forEach(warning => {
      console.log(`   Linha ${warning.line}: ${warning.content.substring(0, 100)}...`);
    });
    if (analysis.warnings.length > 5) {
      console.log(`   ... e mais ${analysis.warnings.length - 5} warnings`);
    }
  }
  
  if (analysis.apiErrors.length > 0) {
    console.log(`\n🌐 ERROS DE API:`);
    analysis.apiErrors.slice(0, 5).forEach(error => {
      console.log(`   Linha ${error.line}: ${error.content.substring(0, 100)}...`);
    });
  }
  
  if (analysis.authIssues.length > 0) {
    console.log(`\n🔐 PROBLEMAS DE AUTENTICAÇÃO:`);
    analysis.authIssues.slice(0, 5).forEach(issue => {
      console.log(`   Linha ${issue.line}: ${issue.content.substring(0, 100)}...`);
    });
  }
  
  // Sugestões baseadas nos padrões encontrados
  console.log(`\n💡 SUGESTÕES DE CORREÇÃO:`);
  
  if (analysis.patterns['403 Forbidden'] > 0) {
    console.log(`   • ${analysis.patterns['403 Forbidden']} erros 403: Verificar se tokens estão sendo enviados corretamente`);
  }
  
  if (analysis.patterns['401 Unauthorized'] > 0) {
    console.log(`   • ${analysis.patterns['401 Unauthorized']} erros 401: Verificar validade dos tokens`);
  }
  
  if (analysis.patterns['Token Issues'] > 0) {
    console.log(`   • ${analysis.patterns['Token Issues']} problemas de token: Verificar localStorage e fluxo de autenticação`);
  }
  
  if (analysis.patterns['Network Error'] > 0) {
    console.log(`   • ${analysis.patterns['Network Error']} erros de rede: Verificar se o backend está rodando`);
  }
  
  console.log(`\n` + '=' .repeat(50));
}

// Função principal
function main() {
  const logFile = process.argv[2];
  
  if (!logFile) {
    console.log('Uso: node analyze-logs.js <arquivo-de-logs>');
    console.log('Exemplo: node analyze-logs.js logs.txt');
    process.exit(1);
  }
  
  if (!fs.existsSync(logFile)) {
    console.log(`❌ Arquivo não encontrado: ${logFile}`);
    process.exit(1);
  }
  
  try {
    const logContent = fs.readFileSync(logFile, 'utf8');
    const analysis = analyzeLogs(logContent);
    generateReport(analysis);
  } catch (error) {
    console.log(`❌ Erro ao ler arquivo: ${error.message}`);
    process.exit(1);
  }
}

main();
