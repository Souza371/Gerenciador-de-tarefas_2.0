# Plano de Testes Abrangentes - Gerenciador de Projetos v2.0

## 1. Testes de Configuração e Ambiente

### 1.1 Verificação de Dependências
```bash
node --version          # Deve ser v16 ou superior
npm --version           # Deve ser v7 ou superior
npm list --depth=0      # Listar todas as dependências diretas
```

**Esperado:**
- ✅ Node.js v16+ instalado
- ✅ npm v7+ instalado
- ✅ Todas as dependências no package.json

### 1.2 Instalação de Dependências
```bash
cd backend
npm install
```

**Esperado:**
- ✅ Sem erros de instalação
- ✅ node_modules criado
- ✅ package-lock.json atualizado

---

## 2. Testes de Banco de Dados

### 2.1 Inicialização do SQLite
```bash
npm start  # Ou npm run dev
```

**Esperado ao iniciar server:**
```
✓ SQLite conectado com sucesso
7 usuários padrão criados
🚀 Servidor rodando em http://localhost:5000
```

### 2.2 Verificação do Banco de Dados
A seguinte seleção SQL deve trabalhar via API:

**Tabelas Criadas:**
- ✅ USUARIOS (com 7 usuários de teste)
- ✅ PROJETOS
- ✅ FASES
- ✅ ATIVIDADES
- ✅ MATERIAIS
- ✅ MAO_OBRA
- ✅ EQUIPAMENTOS

---

## 3. Testes de Autenticação e Autorização

### 3.1 Login com Diferentes Perfis

**Dados de Teste - 7 Contas Padrão:**

#### Admin
```
Email: admin@construtora.com
Senha: Admin@2026
Esperado: Token JWT + dados do usuário
```

#### Gerente de Projetos
```
Email: gerente@construtora.com
Senha: Gerente@2026
Esperado: Token JWT com role "gerente"
```

#### Engenheiro
```
Email: eng.silva@construtora.com
Senha: Eng@2026
Esperado: Token JWT com role "engenheiro"
```

#### Técnico
```
Email: tecnico@construtora.com
Senha: Tecnico@2026
Esperado: Token JWT com role "técnico"
```

#### Cliente
```
Email: cliente@construtora.com
Senha: Cliente@2026
Esperado: Token JWT com role "cliente" (acesso limitado)
```

#### Supervisor de Obras
```
Email: supervisor@construtora.com
Senha: Supervisor@2026
Esperado: Token JWT com role específico
```

#### Contador / Financeiro
```
Email: contador@construtora.com
Senha: Contador@2026
Esperado: Token JWT com role financeiro
```

### 3.2 Controle de Acesso por Perfil

**Admin:**
- ✅ Criar, editar, deletar qualquer coisa
- ✅ Accesso a relatórios financeiros
- ✅ Gerenciar usuários

**Gerente:**
- ✅ Criar e editar projetos
- ✅ Ver todos os projetos
- ❌ Não pode deletar usuários

**Engenheiro:**
- ✅ Criar e editar atividades
- ✅ Ver projetos
- ❌ Não pode deletar projetos

**Técnico:**
- ✅ Ver atividades atribuídas
- ✅ Atualizar status de atividades
- ❌ Não pode criar projetos

**Cliente:**
- ✅ Ver apenas seus projetos
- ❌ Não pode editar

---

## 4. Testes de API - Projetos

### 4.1 Criar Projeto
```bash
curl -X POST http://localhost:5000/api/projetos \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Projeto Teste",
    "descricao": "Descrição teste",
    "localizacao": "São Paulo - SP",
    "tipo": "residencial",
    "responsavel_id": 1,
    "orcamento_total": 50000
  }'
```

**Esperado:** Status 201 + ID do projeto criado

### 4.2 Listar Projetos
```bash
curl -X GET http://localhost:5000/api/projetos \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 + Array de projetos com suas propriedades

### 4.3 Obter Projeto Específico
```bash
curl -X GET http://localhost:5000/api/projetos/1 \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 + Dados completos do projeto

### 4.4 Atualizar Projeto
```bash
curl -X PUT http://localhost:5000/api/projetos/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Nome",
    "status": "em_progresso"
  }'
```

**Esperado:** Status 200 + Projeto atualizado

### 4.5 Deletar Projeto
```bash
curl -X DELETE http://localhost:5000/api/projetos/1 \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 + Mensagem de sucesso

---

## 5. Testes de API - Fases

### 5.1 Criar Fase
```bash
curl -X POST http://localhost:5000/api/fases \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projeto_id": 1,
    "nome": "Fundação",
    "descricao": "Preparação de fundações",
    "ordem": 1
  }'
```

**Esperado:** Status 201 + ID da fase

### 5.2 Listar Fases de um Projeto
```bash
curl -X GET http://localhost:5000/api/projetos/1/fases \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 + Array de fases

### 5.3 Atualizar Status da Fase
```bash
curl -X PUT http://localhost:5000/api/fases/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "concluida", "porcentagem": 100}'
```

**Esperado:** Status 200 + Fase atualizada

---

## 6. Testes de API - Atividades

### 6.1 Criar Atividade
```bash
curl -X POST http://localhost:5000/api/atividades \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fase_id": 1,
    "titulo": "Escavação do terreno",
    "responsavel_id": 3,
    "prioridade": "alta",
    "data_vencimento": "2026-04-10"
  }'
```

**Esperado:** Status 201 + ID da atividade

### 6.2 Listar Atividades
```bash
curl -X GET http://localhost:5000/api/atividades \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 + Array de atividades

### 6.3 Atualizar Status da Atividade
```bash
curl -X PUT http://localhost:5000/api/atividades/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "em_progresso"}'
```

**Esperado:** Status 200 + Atividade atualizada

### 6.4 Marcar Atividade como Concluída
```bash
curl -X PUT http://localhost:5000/api/atividades/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"concluida": true}'
```

**Esperado:** Status 200 + concluida: true

---

## 7. Testes de API - Materiais

### 7.1 Criar Material
```bash
curl -X POST http://localhost:5000/api/materiais \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projeto_id": 1,
    "nome": "Cimento Portland",
    "quantidade": 100,
    "unidade": "sacos",
    "valor_unitario": 25.50
  }'
```

**Esperado:** Status 201 + ID do material + valor_total calculado

### 7.2 Listar Materiais
```bash
curl -X GET http://localhost:5000/api/materiais \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 + Array com todos os materiais

### 7.3 Filtrar Materiais por Projeto
```bash
curl -X GET "http://localhost:5000/api/materiais?projeto_id=1" \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 + Apenas materiais do projeto 1

---

## 8. Testes de Dashboard e Estatísticas

### 8.1 Obter Dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 com:
```json
{
  "total_projetos": X,
  "projetos_em_andamento": Y,
  "taxa_conclusao_media": Z%,
  "total_gastos": R$
}
```

### 8.2 Obter Estatísticas de Projeto
```bash
curl -X GET http://localhost:5000/api/projetos/1/estatisticas \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Status 200 com dados financeiros e progresso

---

## 9. Testes de Frontend

### 9.1 Página de Login
- ✅ Campo de email funciona
- ✅ Campo de senha funciona
- ✅ Botão de login faz requisição ao backend
- ✅ Armazena token em localStorage
- ✅ Redireciona para dashboard após login bem-sucedido
- ❌ Rejeita credenciais inválidas

### 9.2 Dashboard
- ✅ Exibe 4 cards com KPIs (total projetos, em andamento, taxa conclusão, total gastos)
- ✅ Cards mostram números corretos do banco
- ✅ Responsive em mobile, tablet, desktop

### 9.3 Seção de Projetos
- ✅ Lista todos os projetos
- ✅ Exibe cards com: nome, localização, status, orçamento
- ✅ Botão "Novo Projeto" abre modal
- ✅ Modal cria projeto corretamente
- ✅ Atualizar projeto funciona
- ✅ Deletar projeto funciona

### 9.4 Seção de Atividades
- ✅ Lista todas as atividades
- ✅ Exibe: título, status, responsável, data vencimento
- ✅ Filtro por status funciona
- ✅ Marcar como concluída funciona
- ✅ Responsivo em todos os dispositivos

### 9.5 Seção de Materiais
- ✅ Lista materiais do projeto
- ✅ Exibe: nome, quantidade, unidade, valor unitário, valor total
- ✅ Modal para adicionar material
- ✅ Cálculo automático de valor_total (quantidade × valor_unitario)

### 9.6 Navegação
- ✅ Menu funciona em desktop
- ✅ Menu responsivo em mobile
- ✅ Logout limpa token
- ✅ Protege rotas (sem token, redireciona para login)

---

## 10. Testes de Validação e Segurança

### 10.1 Validação de Entrada
- ✅ Email inválido rejeita login
- ✅ Senha vazia não faz requisição
- ✅ Nome do projeto vazio não cria
- ✅ Orçamento negativo rejeita

### 10.2 Segurança
- ✅ Token expirado rejeita requisição
- ✅ Usuário sem permissão no recurso recebe 403
- ✅ Não autenticado recebe 401
- ✅ Senha armazenada com hash (bcrypt)
- ✅ Senhas não são retornadas na API

### 10.3 CORS
- ✅ Frontend (localhost:3000+) consegue fazer requisições
- ✅ Requisições de origem não autorizada são bloqueadas

---

## 11. Testes de Performance

### 11.1 Tempo de Resposta
- ✅ GET /api/dashboard < 500ms
- ✅ GET /api/projetos < 500ms
- ✅ POST /api/projetos < 1s (com validação)

### 11.2 Uso de Memória
- ✅ Servidor inicia com ~50MB de RAM
- ✅ Suporta 100+ requisições simultâneas
- ✅ Sem memory leaks após 1000+ requisições

### 11.3 Responsividade Frontend
- ✅ Dashboard carrega em < 2s
- ✅ Listas atualizam em < 500ms
- ✅ Sem lag ao preencher formulários

---

## 12. Checklist Final

- [ ] Dependências instaladas corretamente
- [ ] Banco de dados criado e populado
- [ ] 7 usuários de teste criados
- [ ] Login funciona com todos os perfis
- [ ] RBAC está funcionando
- [ ] Todos os CRUD da API funcionam
- [ ] Dashboard exibe dados corretos
- [ ] Frontend responsivo em todos os tamanhos
- [ ] Sem erros no console do navegador
- [ ] Sem erros no console do backend
- [ ] Sistema roda sem Node memory warnings
- [ ] Git sincronizado com GitHub

---

## Próximas Etapas para Executar os Testes

1. **Abrir GitHub Codespaces** (veja instruções abaixo)
2. **Executar teste de configuração** (seção 1)
3. **Executar teste de banco de dados** (seção 2)
4. **Executar testes de login** (seção 3) 
5. **Executar testes de API** com curl ou Postman (seções 4-7)
6. **Testar frontend** manualmente (seção 9)
7. **Preencher checklist** (seção 12)

