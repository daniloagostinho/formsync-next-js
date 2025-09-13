#!/usr/bin/env node

const http = require('http');

// Debug específico do erro 403
async function debug403Error() {
  console.log('🔍 DEBUGGING ERRO 403 - FormSync\n');
  console.log('=' .repeat(60));

  try {
    // 1. Verificar se o backend está rodando
    console.log('1. Verificando backend...');
    const backendResponse = await makeRequest('http://localhost:8080/api/v1/usuarios/me', 'GET');
    console.log(`   Status: ${backendResponse.statusCode}`);
    console.log(`   Resposta: ${backendResponse.body}`);
    
    if (backendResponse.statusCode === 403) {
      console.log('   ✅ Backend retorna 403 sem token (comportamento esperado)');
    }

    // 2. Testar com token válido
    console.log('\n2. Testando com token válido...');
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VGaW5nZXJwcmludCI6IjE3NjYzMzc0MjEiLCJpcEFkZHJlc3MiOjE3MTkwMTYyMzUsInVzZXJBZ2VudCI6NTc3OTY3MTk4LCJpc3N1ZWRBdCI6MTc1Nzc5MDU0MzIxNiwic3ViIjoidGVzdGVAZm9ybXN5bmMuY29tIiwiaWF0IjoxNzU3NzkwNTQzLCJleHAiOjE3NTc4MjY1NDN9.wIo2E4D2nWM_kVgFslcMaRjHMY9X2-QhJR_ZBtaqgts";
    
    const tokenResponse = await makeRequest('http://localhost:8080/api/v1/usuarios/me', 'GET', null, {
      'Authorization': `Bearer ${token}`
    });
    
    console.log(`   Status: ${tokenResponse.statusCode}`);
    console.log(`   Resposta: ${tokenResponse.body}`);
    
    if (tokenResponse.statusCode === 200) {
      console.log('   ✅ Backend funciona com token válido');
    } else {
      console.log('   ❌ Problema no backend mesmo com token válido');
    }

    // 3. Verificar se o frontend está fazendo requisições
    console.log('\n3. Verificando requisições do frontend...');
    
    // Simular o que o frontend faz
    console.log('   Simulando requisição do frontend sem token...');
    const frontendResponse = await makeRequest('http://localhost:8080/api/v1/usuarios/me', 'GET');
    console.log(`   Status: ${frontendResponse.statusCode}`);
    
    // 4. Verificar se o problema é no interceptor do frontend
    console.log('\n4. Análise do problema:');
    console.log('   🔍 O erro 403 indica que:');
    console.log('      - A requisição está chegando ao backend');
    console.log('      - O backend está rejeitando por falta de autenticação');
    console.log('      - O token não está sendo enviado ou é inválido');
    
    console.log('\n5. Possíveis causas:');
    console.log('   ❌ Token não está sendo salvo no localStorage');
    console.log('   ❌ Token não está sendo enviado no header Authorization');
    console.log('   ❌ Token expirou ou é inválido');
    console.log('   ❌ Interceptor do axios não está funcionando');
    console.log('   ❌ AuthContext não está funcionando corretamente');

    console.log('\n6. Próximos passos para debug:');
    console.log('   🔧 1. Verificar se o token está no localStorage do navegador');
    console.log('   🔧 2. Verificar se o interceptor está adicionando o header');
    console.log('   🔧 3. Verificar se o AuthContext está funcionando');
    console.log('   🔧 4. Testar o fluxo de login completo');

  } catch (error) {
    console.error('❌ Erro durante debug:', error.message);
  }
}

function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

debug403Error();
