#!/usr/bin/env node

const http = require('http');

// Simular comportamento do usuário para gerar logs
async function simulateUserBehavior() {
  console.log('🔄 Simulando comportamento do usuário para gerar logs...\n');

  const baseUrl = 'http://localhost:3000';
  
  try {
    // 1. Acessar página inicial (deve gerar logs de AuthContext)
    console.log('1. Acessando página inicial...');
    await makeRequest(`${baseUrl}/`);
    await sleep(1000);

    // 2. Acessar página de login (deve gerar logs de API)
    console.log('2. Acessando página de login...');
    await makeRequest(`${baseUrl}/login`);
    await sleep(1000);

    // 3. Acessar dashboard sem autenticação (deve gerar erro 403)
    console.log('3. Tentando acessar dashboard sem autenticação...');
    await makeRequest(`${baseUrl}/dashboard`);
    await sleep(1000);

    // 4. Acessar página de logs
    console.log('4. Acessando página de logs...');
    await makeRequest(`${baseUrl}/logs`);
    await sleep(1000);

    // 5. Simular requisição de API direta (deve gerar erro 403)
    console.log('5. Simulando requisição de API direta...');
    await makeRequest(`${baseUrl}/api/usuarios/me`);
    await sleep(1000);

    console.log('\n✅ Simulação concluída!');
    console.log('Acesse http://localhost:3000/logs para ver os logs gerados');
    console.log('Ou baixe os logs e execute: node analyze-logs.js <arquivo-de-logs>');

  } catch (error) {
    console.error('❌ Erro durante simulação:', error.message);
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`   ✅ ${url} - Status: ${res.statusCode}`);
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ ${url} - Erro: ${error.message}`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

simulateUserBehavior();
