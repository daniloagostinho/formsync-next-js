#!/usr/bin/env node

const http = require('http');

// Testar fluxo completo de autenticação
async function testCompleteAuth() {
  console.log('🔐 Testando fluxo completo de autenticação...\n');

  try {
    // 1. Primeiro, registrar um usuário
    console.log('1. Registrando usuário de teste...');
    const registerResponse = await makeRequest('http://localhost:8080/api/v1/usuarios', 'POST', {
      nome: 'Usuário Teste',
      email: 'teste@formsync.com',
      senha: '123456',
      plano: 'BASIC'
    });
    
    console.log(`   Status: ${registerResponse.statusCode}`);
    if (registerResponse.statusCode === 201) {
      console.log('   ✅ Usuário registrado com sucesso');
    } else {
      console.log(`   ⚠️  Status inesperado: ${registerResponse.statusCode}`);
      console.log(`   Resposta: ${registerResponse.body}`);
    }

    // 2. Fazer login (enviar código)
    console.log('\n2. Enviando código de login...');
    const loginResponse = await makeRequest('http://localhost:8080/api/v1/login', 'POST', {
      email: 'teste@formsync.com',
      senha: '123456'
    });
    
    console.log(`   Status: ${loginResponse.statusCode}`);
    console.log(`   Resposta: ${loginResponse.body}`);

    // 3. Verificar código e obter token
    console.log('\n3. Verificando código e obtendo token...');
    const verifyResponse = await makeRequest('http://localhost:8080/api/v1/login/verificar', 'POST', {
      email: 'teste@formsync.com',
      codigo: '123456'
    });
    
    console.log(`   Status: ${verifyResponse.statusCode}`);
    console.log(`   Resposta: ${verifyResponse.body}`);

    if (verifyResponse.statusCode === 200) {
      const tokenData = JSON.parse(verifyResponse.body);
      if (tokenData.token) {
        console.log('   ✅ Token obtido com sucesso!');
        
        // 4. Testar endpoint protegido com token
        console.log('\n4. Testando endpoint protegido com token...');
        const protectedResponse = await makeRequest('http://localhost:8080/api/v1/usuarios/me', 'GET', null, {
          'Authorization': `Bearer ${tokenData.token}`
        });
        
        console.log(`   Status: ${protectedResponse.statusCode}`);
        console.log(`   Resposta: ${protectedResponse.body}`);
        
        if (protectedResponse.statusCode === 200) {
          console.log('   ✅ Endpoint protegido acessado com sucesso!');
          console.log('\n🎉 FLUXO DE AUTENTICAÇÃO FUNCIONANDO!');
        } else {
          console.log('   ❌ Erro ao acessar endpoint protegido');
        }
      } else {
        console.log('   ❌ Token não encontrado na resposta');
      }
    } else {
      console.log('   ❌ Erro ao verificar código');
    }

  } catch (error) {
    console.error('❌ Erro durante teste:', error.message);
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

testCompleteAuth();
