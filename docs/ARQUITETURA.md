# 🏗️ ARQUITETURA DO PROJETO

## 1. Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│              CLIENTE (Web, Mobile)                      │
├─────────────────────────────────────────────────────────┤
│ Web: HTML5 + CSS3 + JavaScript Vanilla                 │
│ Mobile: React Native + Expo                            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTP/REST
                   │
┌──────────────────▼──────────────────────────────────────┐
│         API REST (Node.js + Express)                    │
├─────────────────────────────────────────────────────────┤
│ Autenticação: JWT + bcryptjs                           │
│ CORS habilitado                                        │
│ Middlewares: JSON, Validation, Auth                    │
└──────────────┬──────────────────────────────────────────┘
               │
               │ SQL
               │
┌──────────────▼──────────────────────────────────────────┐
│     SQLite (Banco de Dados Local)                       │
├─────────────────────────────────────────────────────────┤
│ USUARIOS (7 usuários pré-carregados)                   │
│ TAREFAS (1:N relationship)                             │
└─────────────────────────────────────────────────────────┘
```

## 2. Componentes Principais

### 2.1 Backend (Node.js + Express)

```
backend/
│
├── server.js
│   └─→ Inicializa Express
│   └─→ Configura middlewares
│   └─→ Monta rotas
│   └─→ Inicia servidor na port 5000
│
├── database.js
│   └─→ Cria conexão SQLite
│   └─→ Define schema (DDL)
│   └─→ Insere usuários de teste (seed)
│   └─→ Exporta db instance
│
├── routes.js
│   └─→ POST /auth/login
│   └─→ POST /auth/registrar
│   └─→ GET /usuario/perfil
│   └─→ GET /usuarios
│   └─→ GET /tarefas
│   └─→ POST /tarefas
│   └─→ GET /tarefas/:id
│   └─→ PUT /tarefas/:id
│   └─→ DELETE /tarefas/:id
│   └─→ GET /dashboard/stats
│
├── auth.js
│   └─→ gerarToken(id, email, role)
│   └─→ verificarToken(middleware)
│   └─→ verificarRole(roles[])
│
└── controllers.js
    └─→ login(req, res)
    └─→ registrar(req, res)
    └─→ obterPerfil(req, res)
    └─→ listarUsuarios(req, res)
```

### 2.2 Frontend Web (HTML/CSS/JS)

```
web/
│
├── index.html
│   ├─→ <div id="loginScreen">
│   ├─→ <div id="dashboardScreen">
│   │   ├─→ Navbar
│   │   ├─→ Sidebar (Filtros)
│   │   └─→ Main Content (Tasks Grid)
│   └─→ <div id="taskModal">
│
├── styles.css
│   ├─→ Login screen styles
│   ├─→ Dashboard layout (Flexbox/Grid)
│   ├─→ Task cards
│   ├─→ Modal
│   └─→ Responsive (Mobile-first)
│
└── app.js
    ├─→ init()
    ├─→ handleLogin()
    ├─→ handleLogout()
    ├─→ loadTasks()
    ├─→ renderTasks()
    ├─→ openTaskModal()
    ├─→ handleSaveTask()
    ├─→ deleteTask()
    ├─→ toggleTask()
    └─→ loadStats()
```

### 2.3 Mobile (React Native + Expo)

```
mobile/
│
├── App.js
│   ├─→ useState(token, user, tasks, email, password)
│   ├─→ useEffect (recover token)
│   ├─→ Screen: Login
│   │   └─→ TextInput (email, password)
│   │   └─→ Button (Entrar)
│   ├─→ Screen: Dashboard
│   │   ├─→ FlatList (tasks)
│   │   ├─→ TaskCard (title, desc, actions)
│   │   └─→ Buttons (check, delete)
│   ├─→ handleLogin()
│   ├─→ loadTasks()
│   ├─→ toggleTask()
│   └─→ deleteTask()
│
└── package.json
    └─→ expo, react-native, axios, async-storage
```

## 3. Fluxo de Requisição

### 3.1 Fluxo de Login

```
1. Usuário digita email e senha (UI)
   ↓
2. JavaScript faz POST /api/auth/login
   ↓
3. Express recebe request
   ↓
4. Controller valida input
   ↓
5. Database busca usuário por email
   ↓
6. bcryptjs compara hash de senha
   ↓
7. Se OK: JWT gera token
   ↓
8. Resposta: {token, usuario}
   ↓
9. Frontend armazena token em localStorage
   ↓
10. Renderiza dashboard
```

### 3.2 Fluxo de Criar Tarefa

```
1. Usuário clica "+ Nova Tarefa" (UI)
   ↓
2. Modal abre com formulário
   ↓
3. Usuário preenche e clica "Salvar"
   ↓
4. JavaScript faz POST /api/tarefas com JWT
   ↓
5. Express: middleware verifyToken valida JWT
   ↓
6. Controller extrai usuario.id do token
   ↓
7. INSERT INTO tarefas WITH usuario_id
   ↓
8. Database retorna nova tarefa
   ↓
9. Frontend adiciona à lista (renderTasks())
   ↓
10. UI atualiza com nova tarefa
```

## 4. Autenticação e Segurança

### 4.1 Fluxo de Tokens

```
┌──────────┐
│ Login    │
└────┬─────┘
     │ Email + Senha
     ▼
┌─────────────────────┐
│ Hash Comparison     │
│ bcryptjs.compare()  │
└────┬────────────────┘
     │ ✓ Match
     ▼
┌──────────────────────────┐
│ JWT.sign({              │
│   id, email, role       │
│   expires: 7d           │
│ })                       │
└────┬───────────────────┘
     │ Token
     ▼
┌──────────────────────┐
│ localStorage.token   │
│ Authorization Header │
└──────────────────────┘
                       │
                       │ Request com token
                       ▼
                   ┌─────────────────┐
                   │ JWT.verify()    │
                   │ if valid:       │
                   │  req.usuario = {}│
                   └─────────────────┘
```

### 4.2 Proteção de Endpoints

```
Público:
  POST /auth/login
  POST /auth/registrar

Protegido (qualquer usuário):
  GET /tarefas
  POST /tarefas
  GET /usuario/perfil
  GET /tarefas/:id
  PUT /tarefas/:id
  DELETE /tarefas/:id

Protegido (admin only):
  GET /usuarios
```

## 5. Modelo de Dados

### 5.1 Tabelas e Relacionamentos

```
USUARIOS Table:
┌─────────────────────────────────────────┐
│ id (PK, AI)  | INTEGER PRIMARY KEY     │
│ email (UQ)   | VARCHAR UNIQUE          │
│ nome         | VARCHAR                 │
│ senha        | VARCHAR (HASH)          │
│ role         | VARCHAR (admin, etc)    │
│ criado_em    | DATETIME DEFAULT NOW()  │
└─────────────────────────────────────────┘

TAREFAS Table:
┌──────────────────────────────────────────┐
│ id (PK, AI)     | INTEGER PRIMARY KEY   │
│ titulo          | VARCHAR               │
│ descricao       | TEXT                  │
│ usuario_id (FK) | INTEGER → USUARIOS    │
│ categoria       | VARCHAR               │
│ status          | VARCHAR               │
│ prioridade      | VARCHAR               │
│ data_vencimento | DATE                  │
│ concluida       | BOOLEAN (0/1)         │
│ criado_em       | DATETIME DEFAULT NOW()│
│ atualizado_em   | DATETIME DEFAULT NOW()│
└──────────────────────────────────────────┘
```

## 6. Padrões de Desenvolvimento

### 6.1 Backend (Express + Node)

```javascript
// Padrão: Route → Middleware → Controller → Database

// Route
router.get('/tarefas', verificarToken, controllers.buscarTarefas);

// Middleware
middleware verificarToken(req, res, next) {
  token = extract from Authorization header
  user = JWT.verify(token)
  req.usuario = user
  next()
}

// Controller
controllers.buscarTarefas(req, res) {
  db.all(query, [req.usuario.id], (err, data) => {
    res.json(data)
  })
}

// Database
SQLite: SELECT * FROM tarefas WHERE usuario_id = ?
```

### 6.2 Frontend (Vanilla JS + Fetch)

```javascript
// Padrão: Event → Fetch → State Update → Render

// 1. Event Listener
loginBtn.addEventListener('click', handleLogin)

// 2. Fetch API
async function handleLogin(e) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({email, senha})
  })
}

// 3. State Update
authToken = data.token
localStorage.setItem('token', authToken)

// 4. Render
showDashboard()
```

## 7. Performance

### 7.1 Otimizações

- **Backend**: Prepared statements (SQL injection prevention)
- **Frontend**: Lazy loading, debounce search
- **Database**: Índices em frequently queried columns
- **Network**: Compression, caching headers (futuro)

### 7.2 Tamanhos

```
Backend: ~2.5MB (node_modules não-contado)
Frontend: ~50KB (HTML+CSS+JS)
Database: ~4KB (vazio)
Total (sem deps): ~54KB
```

## 8. Deploy (Futuro)

```
┌──────────────────────────────────────────────┐
│ GitHub (repository)                          │
│ ├─→ main (production-ready)                  │
│ ├─→ develop (staging)                        │
│ └─→ feature/* (development)                  │
└───────────┬──────────────────────────────────┘
            │
            │ Push
            ▼
┌──────────────────────────────────────────────┐
│ GitHub Actions (CI/CD)                       │
│ ├─→ Run tests                                │
│ ├─→ Build                                    │
│ └─→ Deploy                                   │
└───────────┬──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────┐
│ Heroku/Railway (Production)                  │
│ ├─→ Node.js server running                   │
│ ├─→ SQLite persisted                         │
│ └─→ HTTPS enabled                            │
└──────────────────────────────────────────────┘
```

---

**Criado em:** 24/03/2026  
**Versão:** 1.0  
**Autor:** Vicente de Souza
