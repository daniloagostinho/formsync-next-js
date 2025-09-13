#!/usr/bin/env node

const axios = require('axios');

// Configuração
const API_BASE_URL = 'http://localhost:8080/api/v1';
const TEST_TOKEN = process.argv[2]; // Token como argumento da linha de comando

if (!TEST_TOKEN) {
  console.log('❌ Uso: node test-api.js [TOKEN]');
  console.log('📝 Exemplo: node test-api.js "seu-token-aqui"');
  process.exit(1);
}

async function testApi() {
  console.log('🧪 Testando API de Templates...');
  console.log(`📍 URL: ${API_BASE_URL}/templates`);
  console.log(`🔑 Token: ${TEST_TOKEN.substring(0, 20)}...`);
  console.log('');

  try {
    const response = await axios.get(`${API_BASE_URL}/templates`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
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
      console.log(`🔍 Headers:`, JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.log('🌐 Erro de rede - Backend não está rodando?');
      console.log('💡 Verifique se o backend está rodando em http://localhost:8080');
    } else {
      console.log('⚠️ Erro:', error.message);
    }
  }
}

testApi();

