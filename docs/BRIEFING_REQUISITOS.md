# 📋 GERENCIADOR DE TAREFAS 2.0

## 1. BRIEFING COMPLETO

### 1.1 Descrição do Projeto
Sistema web e mobile completo para gerenciamento de tarefas e atividades do dia a dia. Permite que os usuários criem, organizem, priorizem e acompanhem suas tarefas de forma simples e intuitiva.

### 1.2 Público-Alvo
- Profissionais autônomos
- Pessoas que precisam organizar atividades pessoais
- Gerentes de projetos pequenos
- Estudantes
- Equipes de desenvolvimento (com papéis específicos)

### 1.3 Problema Resolvido
Falta de uma ferramenta simples, leve e responsiva para organização de tarefas que não consuma muitos recursos do PC, permitindo acesso tanto via web quanto mobile.

### 1.4 Funcionalidades Principais
✅ **Autenticação segura** com JWT e roles de usuário  
✅ **CRUD completo de tarefas**  
✅ **Categorização de tarefas** (Geral, Trabalho, Pessoal, Estudo)  
✅ **Priorização** (Baixa, Média, Alta)  
✅ **Status de tarefas** (Pendente, Em Progresso, Concluída)  
✅ **Data de vencimento** para tarefas  
✅ **Dashboard com estatísticas**  
✅ **Filtros avançados** por status, categoria, prioridade  
✅ **Responsividade total** (Web e Mobile)  
✅ **Pesquisa de tarefas** em tempo real  

### 1.5 Tecnologias Utilizadas
- **Backend:** Node.js + Express.js
- **Banco de Dados:** SQLite (leve, sem servidor)
- **Frontend Web:** HTML5 + CSS3 + JavaScript Vanilla
- **Mobile:** React Native (Expo)
- **Autenticação:** JWT + bcryptjs
- **Versionamento:** Git + GitHub

---

## 2. REQUISITOS FUNCIONAIS

### RF-001: Autenticação de Usuário
- O usuário deve fazer login com email e senha
- Sistema deve gerar token JWT após autenticação bem-sucedida
- Usuário pode fazer logout a qualquer momento
- Tokens expiram em 7 dias
- Senhas são criptografadas com bcryptjs

### RF-002: Gerenciamento de Tarefas
- Usuário pode criar nova tarefa com título, descrição, categoria, prioridade e data de vencimento
- Usuário pode editar tarefa existente
- Usuário pode deletar tarefa
- Usuário pode marcar tarefa como concluída
- Usuário pode desfazer conclusão de tarefa

### RF-003: Organização de Tarefas
- Tarefas podem ter 4 categorias: Geral, Trabalho, Pessoal, Estudo
- Tarefas podem ter 3 níveis de prioridade: Baixa, Média, Alta
- Tarefas têm status: Pendente, Em Progresso, Concluída

### RF-004: Filtros e Pesquisa
- Usuário pode filtrar tarefas por status
- Usuário pode pesquisar tarefas por título ou descrição
- Sistema mostra contagem de tarefas por filtro

### RF-005: Dashboard e Estatísticas
- Dashboard exibe total de tarefas
- Dashboard exibe tarefas pendentes
- Dashboard exibe tarefas em progresso
- Dashboard exibe tarefas concluídas

### RF-006: Controle de Acesso por Roles
- Admin: acesso total ao sistema
- Gerente: pode gerenciar próprias tarefas
- Engenheiro: pode gerenciar próprias tarefas
- Técnico: pode gerenciar próprias tarefas
- Cliente: pode gerenciar próprias tarefas

---

## 3. REQUISITOS NÃO FUNCIONAIS

### RNF-001: Performance
- API responde em menos de 200ms
- Frontend carrega em menos de 2 segundos
- Suporta até 1000 tarefas por usuário sem degradação

### RNF-002: Escalabilidade
- Banco de dados SQLite suporta múltiplos usuários simultâneos
- Possibilidade de migração futura para PostgreSQL

### RNF-003: Segurança
- Senhas são hash com bcryptjs (10 rounds)
- Endpoints protegidos requerem JWT válido
- CORS habilitado para acesso seguro da API
- Validação de entrada em todos os endpoints

### RNF-004: Responsividade
- Web funciona em desktop, tablet e mobile
- Mobile otimizado para Android e iOS
- Breakpoints: 320px, 768px, 1024px

### RNF-005: Compatibilidade
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Android 8.0+
- iOS 12.0+

### RNF-006: Usabilidade
- Interface intuitiva e sem complexidade
- Mensagens de erro claras
- Feedback visual para ações do usuário

---

## 4. MAPA DE TELAS (USER FLOW)

### 4.1 WEB
```
Login
  ↓
Dashboard (Listagem de Tarefas)
  ├── Nova Tarefa (Modal)
  ├── Editar Tarefa (Modal)
  ├── Deletar Tarefa (Confirm)
  └── Sobre (Página Info)
```

### 4.2 MOBILE
```
Login
  ↓
Home (Listagem de Tarefas)
  ├── Card de Tarefa
  ├── Ações (Check, Delete)
  └── Perfil/Logout
```

---

## 5. PROTÓTIPO DE BAIXA FIDELIDADE

### 5.1 Tela de Login (Web e Mobile)
```
┌─────────────────────────┐
│  📋 Gerenciador Tarefas │
│                          │
│  [Email...........]      │
│  [Senha...........]      │
│  [  ENTRAR  ]            │
│                          │
│ Teste: email@ex.com      │
└─────────────────────────┘
```

### 5.2 Dashboard (Web)
```
┌────────────────────────────────────────┐
│ 📋 Tarefas    |  usuario@email │ Sair │
├──────────────┬────────────────────────┤
│ FILTROS      │ [+ Nova Tarefa]        │
│              │ [Pesquisar.............] │
│ ○ Todas (5)  │                        │
│ ○ Pendentes  │ ┌──────────┐ ┌───────┐│
│ ○ Em Prog.   │ │ Tarefa 1 │ │Tarefa2││
│ ○ Concluídas │ │[✓][✎][🗑]│ │[...] ││
│              │ └──────────┘ └───────┘│
│ STATS        │ ┌──────────┐ ┌───────┐│
│ Total: 5     │ │ Tarefa 3 │ │Tarefa4││
│ Pend.: 2     │ │[✓][✎][🗑]│ │[...] ││
│ Em Prog: 1   │ └──────────┘ └───────┘│
│ Conc.: 2     └────────────────────────┘
```

---

## 6. MODELO DO BANCO DE DADOS

### 6.1 Entidades

#### USUARIOS
```
┌─────────────────────────────┐
│ USUARIOS                    │
├─────────────────────────────┤
│ id (INT, PK)                │
│ email (VARCHAR, UNIQUE)     │
│ nome (VARCHAR)              │
│ senha (VARCHAR, HASH)       │
│ role (VARCHAR)              │
│ criado_em (DATETIME)        │
└─────────────────────────────┘
```

#### TAREFAS
```
┌──────────────────────────────┐
│ TAREFAS                      │
├──────────────────────────────┤
│ id (INT, PK)                 │
│ titulo (VARCHAR)             │
│ descricao (TEXT)             │
│ usuario_id (INT, FK)         │
│ categoria (VARCHAR)          │
│ status (VARCHAR)             │
│ prioridade (VARCHAR)         │
│ data_vencimento (DATE)       │
│ concluida (BOOLEAN)          │
│ criado_em (DATETIME)         │
│ atualizado_em (DATETIME)     │
└──────────────────────────────┘
```

### 6.2 Relacionamentos
- 1 USUARIO → N TAREFAS (one-to-many)
- FK: tarefas.usuario_id → usuarios.id

### 6.3 Script de Criação (SQL)
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  senha TEXT NOT NULL,
  role TEXT DEFAULT 'cliente',
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  usuario_id INTEGER NOT NULL,
  categoria TEXT DEFAULT 'geral',
  status TEXT DEFAULT 'pendente',
  prioridade TEXT DEFAULT 'media',
  data_vencimento DATE,
  concluida INTEGER DEFAULT 0,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

---

## 7. ARQUITETURA DO BACK-END

### 7.1 Estrutura MVC + API REST

```
backend/
├── server.js              # Entry point principal
├── database.js            # Conexão e inicialização SQLite
├── auth.js                # Funções de autenticação JWT
├── controllers.js         # Lógica de negócio
├── routes.js              # Definição de rotas API
├── package.json           # Dependências
├── .env                   # Variáveis de ambiente
└── tasks.db               # Banco de dados SQLite
```

### 7.2 Fluxo de Requisição

```
CLIENT (Web/Mobile)
    ↓
Express Middleware (CORS, JSON)
    ↓
Route Handler
    ↓
Auth Middleware (JWT)
    ↓
Role Verification (se necessário)
    ↓
Controller Logic
    ↓
Database Query (SQLite)
    ↓
Response JSON
    ↓
CLIENT
```

### 7.3 Endpoints da API

#### Autenticação
```
POST   /api/auth/login              Login do usuário
POST   /api/auth/registrar          Registro de novo usuário
GET    /api/usuario/perfil          Get perfil autenticado
GET    /api/usuarios                List todos (admin)
```

#### Tarefas
```
GET    /api/tarefas                 List tarefas do usuário
POST   /api/tarefas                 Create nova tarefa
GET    /api/tarefas/:id             Get tarefa por ID
PUT    /api/tarefas/:id             Update tarefa
DELETE /api/tarefas/:id             Delete tarefa
```

#### Dashboard
```
GET    /api/dashboard/stats         Get estatísticas
```

---

## 8. ESPECIFICAÇÕES TÉCNICAS

### 8.1 Dependências Backend
- express@4.18.2
- sqlite3@5.1.6
- cors@2.8.5
- dotenv@16.0.3
- bcryptjs@2.4.3
- jsonwebtoken@9.0.0

### 8.2 Variáveis de Ambiente
```
PORT=5000
NODE_ENV=development
JWT_SECRET=seu_segredo_super_secreto
DATABASE_URL=./tasks.db
```

### 8.3 Usuários de Teste Pré-carregados
```
Email: vicentedesouza762@gmail.com | Senha: Admin@2026 | Role: admin
Email: francisco@projeto.com | Senha: Admin@2026 | Role: admin
Email: professor@projeto.com | Senha: Admin@2026 | Role: admin
Email: gerenteteste@projeto.com | Senha: Gerente@123 | Role: gerente
Email: engenheiroteste@projeto.com | Senha: Engenheiro@123 | Role: engenheiro
Email: tecnicoteste@projeto.com | Senha: Tecnico@123 | Role: tecnico
Email: clienteteste@projeto.com | Senha: Cliente@123 | Role: cliente
```

---

## 9. PADRÕES E BOAS PRÁTICAS

### 9.1 Código
- Uso de modules ES6 (import/export)
- Funções assíncronas com async/await
- Tratamento de erros com try/catch
- Validação de entrada em todos endpoints

### 9.2 Banco de Dados
- Prepared statements para SQL injection prevention
- Índices em campos frequently queried
- Foreign keys com cascade delete
- Timestamps em todas tabelas

### 9.3 Segurança
- Hash de senhas com bcryptjs
- JWT para autenticação stateless
- CORS restrito
- Validação de roles
- Rate limiting (futuro)

### 9.4 Frontend
- Mobile-first approach
- CSS Grid e Flexbox
- LocalStorage para token
- Async/await para API calls
- Tratamento de erros com Alert

---

## 10. COMO EXECUTAR

### 10.1 Backend
```bash
cd backend
npm install
npm start
# Servidor roda em http://localhost:5000
```

### 10.2 Frontend Web
```bash
cd web
# Abrir index.html em navegador (http://localhost:8000)
# ou usar Live Server do VS Code
```

### 10.3 Mobile
```bash
cd mobile
npm install -g expo-cli
npm start
# Escanear QR code com Expo Go app
```

---

## 11. MÉTRICAS E SUCESSO

✅ **Funcionalidade:** Todas as user stories implementadas  
✅ **Performance:** <200ms na maioria dos endpoints  
✅ **Usabilidade:** Interface clara e sem bugs  
✅ **Segurança:** Autenticação e autorização funcionando  
✅ **Responsividade:** Funciona em desktop, tablet e mobile  
✅ **Documentação:** Código comentado e README completo  

---

**Data:** 24 de Março de 2026  
**Autor:** Vicente de Souza  
**Versão:** 1.0.0
