#!/usr/bin/env node

const axios = require('axios');

// Configuração
const API_BASE_URL = 'http://localhost:8080/api/v1';

async function testTemplatesApi(token, userId = 6) {
  console.log('🧪 Testando API de Templates...');
  console.log(`📍 URL: ${API_BASE_URL}/templates/usuario/${userId}`);
  console.log(`🔑 Token: ${token ? `${token.substring(0, 20)}...` : 'NENHUM'}`);
  console.log(`👤 User ID: ${userId}`);
  console.log('');

  if (!token) {
    console.log('❌ Token não fornecido!');
    console.log('📝 Uso: node test-templates-api.js [TOKEN] [USER_ID]');
    console.log('💡 Para obter o token, abra debug-token.html no navegador');
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/templates/usuario/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Sucesso!');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📦 Dados:`, JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ Erro!');
    
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📦 Dados:`, JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 403) {
        console.log('');
        console.log('🔍 Diagnóstico do erro 403:');
        console.log('1. Token pode estar expirado');
        console.log('2. Token pode ser inválido');
        console.log('3. Usuário pode não ter permissão para acessar templates');
        console.log('4. Backend pode estar rejeitando o token');
        console.log('');
        console.log('💡 Soluções:');
        console.log('- Faça login novamente no frontend');
        console.log('- Verifique se o token está correto');
        console.log('- Verifique as permissões do usuário no backend');
      }
    } else if (error.request) {
      console.log('🌐 Erro de rede - Backend não está rodando?');
      console.log('💡 Verifique se o backend está rodando em http://localhost:8080');
    } else {
      console.log('⚠️ Erro:', error.message);
    }
  }
}

// Obter token e userId dos argumentos da linha de comando
const token = process.argv[2];
const userId = process.argv[3] ? parseInt(process.argv[3]) : 6;
testTemplatesApi(token, userId);
