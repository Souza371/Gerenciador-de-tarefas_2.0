# DOCUMENTAÇÃO DA API REST

## 📚 Base URL
```
http://localhost:5000/api
```

## 🔐 Autenticação
Todos os endpoints exceto `/auth/login` e `/auth/registrar` requerem:
```
Authorization: Bearer {token_jwt}
```

---

## 🔑 ENDPOINTS DE AUTENTICAÇÃO

### 1. Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "vicentedesouza762@gmail.com",
  "senha": "Admin@2026"
}

Response (200):
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "vicentedesouza762@gmail.com",
    "nome": "Vicente de Souza",
    "role": "admin"
  }
}

Response (401):
{
  "erro": "Usuário não encontrado"
}
```

### 2. Registrar
```
POST /auth/registrar
Content-Type: application/json

Request:
{
  "email": "novo@email.com",
  "nome": "Novo Usuário",
  "senha": "Senha@123",
  "role": "cliente"
}

Response (201):
{
  "sucesso": true,
  "token": "...",
  "usuario": {...}
}
```

### 3. Obter Perfil
```
GET /usuario/perfil
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "email": "vicentedesouza762@gmail.com",
  "nome": "Vicente de Souza",
  "role": "admin",
  "criado_em": "2026-03-24T10:00:00Z"
}
```

---

## 📋 ENDPOINTS DE TAREFAS

### 1. Criar Tarefa
```
POST /tarefas
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "titulo": "Estudar React",
  "descricao": "Aprender conceitos básicos de React",
  "categoria": "estudo",
  "prioridade": "alta",
  "data_vencimento": "2026-04-01"
}

Response (201):
{
  "id": 1,
  "titulo": "Estudar React",
  "descricao": "Aprender conceitos básicos de React",
  "usuario_id": 1,
  "categoria": "estudo",
  "prioridade": "alta",
  "status": "pendente",
  "concluida": 0,
  "criado_em": "2026-03-24T10:00:00Z"
}
```

### 2. Listar Tarefas
```
GET /tarefas
Authorization: Bearer {token}

Query Parameters (opcionais):
?status=pendente
?categoria=trabalho
?prioridade=alta

Response (200):
[
  {
    "id": 1,
    "titulo": "Estudar React",
    "descricao": "...",
    "usuario_id": 1,
    "categoria": "estudo",
    "status": "pendente",
    "prioridade": "alta",
    "data_vencimento": "2026-04-01",
    "concluida": 0,
    "criado_em": "2026-03-24T10:00:00Z",
    "atualizado_em": "2026-03-24T10:00:00Z"
  },
  {...}
]
```

### 3. Obter Tarefa por ID
```
GET /tarefas/{id}
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "titulo": "Estudar React",
  ...
}

Response (404):
{
  "erro": "Tarefa não encontrada"
}
```

### 4. Atualizar Tarefa
```
PUT /tarefas/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "titulo": "Estudar Vue.js",
  "descricao": "Migrar de React para Vue",
  "categoria": "estudo",
  "prioridade": "media",
  "status": "em_progresso",
  "data_vencimento": "2026-04-05",
  "concluida": 0
}

Response (200):
{
  "sucesso": true,
  "mensagem": "Tarefa atualizada"
}
```

### 5. Deletar Tarefa
```
DELETE /tarefas/{id}
Authorization: Bearer {token}

Response (200):
{
  "sucesso": true,
  "mensagem": "Tarefa deletada"
}

Response (404):
{
  "erro": "Tarefa não encontrada"
}
```

---

## 📊 ENDPOINTS DO DASHBOARD

### 1. Estatísticas
```
GET /dashboard/stats
Authorization: Bearer {token}

Response (200):
{
  "total": 10,
  "pendentes": 5,
  "em_progresso": 2,
  "concluidas": 3
}
```

---

## 👥 ENDPOINTS DE USUÁRIOS (ADMIN ONLY)

### 1. Listar Todos os Usuários
```
GET /usuarios
Authorization: Bearer {token_admin}

Response (200):
[
  {
    "id": 1,
    "email": "vicentedesouza762@gmail.com",
    "nome": "Vicente de Souza",
    "role": "admin",
    "criado_em": "2026-03-24T10:00:00Z"
  },
  {...}
]

Response (403):
{
  "erro": "Acesso negado"
}
```

---

## ⚙️ CÓDIGOS DE RESPOSTA HTTP

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

---

## 🧪 TESTE COM CURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vicentedesouza762@gmail.com","senha":"Admin@2026"}'
```

### Criar Tarefa
```bash
curl -X POST http://localhost:5000/api/tarefas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "titulo":"Minha Tarefa",
    "descricao":"Descrição da tarefa",
    "categoria":"trabalho",
    "prioridade":"alta",
    "data_vencimento":"2026-04-01"
  }'
```

### Listar Tarefas
```bash
curl http://localhost:5000/api/tarefas \
  -H "Authorization: Bearer {seu_token}"
```

---

**Última atualização:** 24/03/2026
