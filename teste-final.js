#!/usr/bin/env node

const axios = require('axios');

// Configuração
const API_BASE_URL = 'http://localhost:8080/api/v1';
const TEST_EMAIL = 'teste@exemplo.com';
const TEST_USER_ID = 27;

async function testeCompleto() {
  console.log('🧪 Teste Completo - Template Manager');
  console.log('=====================================');
  
  try {
    // 1. Fazer login e obter token
    console.log('\n1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/login/verificar`, {
      email: TEST_EMAIL,
      codigo: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');
    console.log(`🔑 Token: ${token.substring(0, 50)}...`);
    
    // 2. Testar API de templates
    console.log('\n2️⃣ Testando API de templates...');
    const templatesResponse = await axios.get(`${API_BASE_URL}/templates/usuario/${TEST_USER_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API de templates funcionando');
    console.log(`📊 Status: ${templatesResponse.status}`);
    console.log(`📦 Templates: ${JSON.stringify(templatesResponse.data)}`);
    
    // 3. Testar criação de template
    console.log('\n3️⃣ Testando criação de template...');
    const novoTemplate = {
      nome: 'Template de Teste',
      descricao: 'Template criado via teste automatizado',
      campos: [
        { nome: 'Nome', valor: 'João Silva', tipo: 'text', ordem: 1 },
        { nome: 'Email', valor: 'joao@exemplo.com', tipo: 'email', ordem: 2 }
      ],
      usuarioId: TEST_USER_ID
    };
    
    const createResponse = await axios.post(`${API_BASE_URL}/templates`, novoTemplate, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Template criado com sucesso');
    console.log(`📝 ID: ${createResponse.data.id}`);
    console.log(`📝 Nome: ${createResponse.data.nome}`);
    
    // 4. Listar templates novamente
    console.log('\n4️⃣ Listando templates após criação...');
    const templatesResponse2 = await axios.get(`${API_BASE_URL}/templates/usuario/${TEST_USER_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Templates listados');
    console.log(`📊 Total: ${templatesResponse2.data.length}`);
    console.log(`📦 Dados: ${JSON.stringify(templatesResponse2.data, null, 2)}`);
    
    console.log('\n🎉 Teste completo realizado com sucesso!');
    console.log('✅ Backend funcionando');
    console.log('✅ Autenticação JWT funcionando');
    console.log('✅ API de templates funcionando');
    console.log('✅ Criação de templates funcionando');
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message);
    
    if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error(`📦 Dados: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    
    process.exit(1);
  }
}

// Executar teste
testeCompleto();
