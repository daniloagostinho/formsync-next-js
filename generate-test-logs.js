#!/usr/bin/env node

const http = require('http');

// Simular requisições para gerar logs
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Log-Generator',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function generateTestLogs() {
  console.log('🔄 Gerando logs de teste...\n');

  try {
    // 1. Acessar página inicial
    console.log('1. Acessando página inicial...');
    await makeRequest('/');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Acessar página de logs
    console.log('2. Acessando página de logs...');
    await makeRequest('/logs');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Tentar acessar dashboard (deve gerar erro 403)
    console.log('3. Tentando acessar dashboard (sem autenticação)...');
    await makeRequest('/dashboard');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Simular requisição de API sem token
    console.log('4. Simulando requisição de API sem token...');
    await makeRequest('/api/usuarios/me');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. Acessar página de login
    console.log('5. Acessando página de login...');
    await makeRequest('/login');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n✅ Logs de teste gerados!');
    console.log('Acesse http://localhost:3002/logs para ver os logs em tempo real');
    console.log('Ou baixe os logs e execute: node analyze-logs.js <arquivo-de-logs>');

  } catch (error) {
    console.error('❌ Erro ao gerar logs de teste:', error.message);
  }
}

generateTestLogs();
