#!/usr/bin/env node

const http = require('http');

// Verificar se há logs no localStorage
async function checkLogs() {
  console.log('🔍 Verificando logs gerados...\n');

  try {
    // Acessar página de logs para verificar se há logs
    const response = await makeRequest('http://localhost:3000/logs');
    
    if (response.statusCode === 200) {
      console.log('✅ Página de logs acessível');
      
      // Verificar se há logs na resposta HTML
      if (response.data.includes('Total de logs: 0')) {
        console.log('⚠️  Nenhum log encontrado ainda');
        console.log('💡 Os logs são gerados no lado do cliente (browser)');
        console.log('💡 Acesse http://localhost:3000/logs no navegador para ver os logs');
      } else {
        console.log('✅ Logs encontrados na página');
      }
    } else {
      console.log(`❌ Erro ao acessar página de logs: ${response.statusCode}`);
    }

    // Verificar se o backend está rodando
    console.log('\n🔍 Verificando backend...');
    try {
      const backendResponse = await makeRequest('http://localhost:8080/api/v1/usuarios/me');
      console.log(`Backend status: ${backendResponse.statusCode}`);
    } catch (error) {
      console.log('❌ Backend não está rodando ou não acessível');
      console.log('💡 Inicie o backend com: cd ../SASS/backend && ./mvnw spring-boot:run');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar logs:', error.message);
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
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

checkLogs();
