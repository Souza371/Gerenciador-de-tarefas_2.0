# 🏗️ Arquitetura Visual do Sistema

## 📐 Diagrama Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUÁRIO FINAL                                │
│                    (Desktop / Tablet / Mobile)                       │
└────────────┬───────────────────────┬──────────────────────┬──────────┘
             │                       │                      │
      ┌──────▼──────┐        ┌──────▼──────┐       ┌──────▼──────┐
      │ Web Browser │        │ React Native│       │ Mobile App  │
      │ (Chrome,    │        │ (Expo CLI)  │       │ (Android/   │
      │  Firefox)   │        │             │       │  iOS)       │
      └──────┬──────┘        └──────┬──────┘       └──────┬──────┘
             │                      │                     │
             └──────────────────────┼─────────────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │   HTTP/HTTPS/REST       │
                       │   (JSON over HTTP)      │
                       └────────────┬────────────┘
                                    │
        ┌───────────────────────────▼───────────────────────────────┐
        │              API REST (Node.js + Express)                  │
        │              Porta: 5000                                   │
        │  ┌────────────────────────────────────────────────────┐   │
        │  │  JWT Middleware (Autenticação & Autorização)       │   │
        │  └────────────────────────────────────────────────────┘   │
        │         ▲                                                  │
        │         │                                                  │
        │  ┌──────┴────────────────────────────────────────────┐    │
        │  │            CONTROLLERS (Lógica)                   │    │
        │  ├──────────────────────────────────────────────────┤    │
        │  │ • auth.js (login, token)                         │    │
        │  │ • controllers.js (usuários)                      │    │
        │  │ • projectControllers.js (projetos, etc)          │    │
        │  └──────────────────────────────────────────────────┘    │
        │                       │                                    │
        │                       ▼ SQL                                │
        └─────────────────────────────────────────────────────────┘
                                │
                 ┌──────────────▼──────────────┐
                 │   SQLite Database           │
                 │   (tasks.db)                │
                 │   ┌──────────────────────┐  │
                 │   │ USUARIOS             │  │
                 │   │ PROJETOS             │  │
                 │   │ FASES                │  │
                 │   │ ATIVIDADES           │  │
                 │   │ MATERIAIS            │  │
                 │   │ MAO_OBRA             │  │
                 │   │ EQUIPAMENTOS         │  │
                 │   └──────────────────────┘  │
                 └─────────────────────────────┘
```

---

## 🔄 Fluxo de Login

```
┌─────────────────┐
│  Usuário digita │
│ email/senha     │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │ Frontend: handleLogin()              │
    │ POST /api/auth/login                │
    │ { email, senha }                    │
    └────────┬────────────────────────────┘
             │
             ▼ HTTP
    ┌─────────────────────────────────────┐
    │ Backend: auth/login endpoint        │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ 1. controllers.login()              │
    │ 2. Busca usuário no BD por email    │
    │ 3. bcryptjs.compareSync(senha)      │
    │ 4. Se OK: gerarToken(user)          │
    │ 5. Retorna: { token, usuario }      │
    └────────┬────────────────────────────┘
             │
             ▼ JSON Response
    ┌─────────────────────────────────────┐
    │ Frontend recebe token               │
    │ localStorage.setItem('token', ...)  │
    │ Redireciona para dashboard          │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Usuário vê Dashboard                │
    │ ✅ Sistema pronto para usar         │
    └─────────────────────────────────────┘
```

---

## 📊 Fluxo de Criar Projeto

```
┌────────────────────────────────────────┐
│ Usuário clica "+ Novo Projeto"         │
└────────────────┬───────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │ openModal(projectModal)             │
    │ Modal aparece na tela               │
    └────────────┬───────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │ Usuário preenche formulário:        │
    │ • Nome do projeto                   │
    │ • Localização                       │
    │ • Tipo (residencial/comercial)      │
    │ • Data de início                    │
    │ • Data prevista                     │
    │ • Orçamento total                   │
    │ • Descrição                         │
    └────────────┬───────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │ Usuário clica "Criar Projeto"       │
    └────────────┬───────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │ Frontend: handleCreateProject()     │
    │ POST /api/projetos                  │
    │ Headers: Authorization: Bearer ...  │
    │ Body: { nome, localizacao, ... }    │
    └────────────┬───────────────────────┘
                 │
                 ▼ HTTP
    ┌─────────────────────────────────────┐
    │ Backend: criarProjeto()             │
    │ 1. Valida dados                     │
    │ 2. Insere em projetos table         │
    │ 3. Retorna: { sucesso, projeto }    │
    └────────────┬───────────────────────┘
                 │
                 ▼ Sucesso
    ┌─────────────────────────────────────┐
    │ Frontend: showAlert('✅ Sucesso')   │
    │ closeModal(projectModal)            │
    │ loadProjetos() ← recarrega lista    │
    │ loadDashboard() ← atualiza stats    │
    └────────────┬───────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │ ✅ Novo projeto aparece na lista    │
    │ Usuário pode visualizar/editar      │
    └─────────────────────────────────────┘
```

---

## 🔐 Fluxo de Autenticação (JWT)

```
┌─────────────────────────────────────────────────────────────┐
│                   SEM AUTENTICAÇÃO                          │
│  API: GET /api/projetos (sem token)                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │ Backend: verificarToken middleware                 │
    │ if (!token in header) {                            │
    │   return 401 status                                │
    │ }                                                  │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼ Erro
    ┌────────────────────────────────────────────────────┐
    │ Frontend recebe 401 (não autorizado)               │
    │ Redireciona para login                             │
    └────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   COM AUTENTICAÇÃO                          │
│  API: GET /api/projetos                                     │
│  Headers: Authorization: Bearer eyJhbGciOiJIUzI1N... │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │ Backend: verificarToken middleware                 │
    │ 1. Extrai token do header                          │
    │ 2. jwt.verify(token, SECRET)                       │
    │ 3. Se válido: req.usuario = { id, email, role }   │
    │ 4. next() → continua para o controller             │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │ Backend: listarProjetos() controller               │
    │ Busca projetos do usuário logado                   │
    │ SELECT * FROM projetos                            │
    │ WHERE responsavel_id = req.usuario.id              │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼ Sucesso
    ┌────────────────────────────────────────────────────┐
    │ Frontend recebe: [ { id, nome, ... }, ... ]        │
    │ Renderiza lista de projetos                        │
    └────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Dados: Relacionamentos

```
USUARIOS (1)
    │
    ├─────────────────┐
    │ 1:N             │
    │ (responsável)   │
    │                 │
    ▼                 │
PROJETOS (N)          │
    │                 │
    ├─── 1:N ──────►MATERIAIS (N)
    │
    ├─── 1:N ──────►MAO_OBRA (N) ──► USUARIOS
    │
    ├─── 1:N ──────►EQUIPAMENTOS (N)
    │
    └─── 1:N ──────►FASES (N)
                        │
                        ├─ 1:N ──────►ATIVIDADES (N)
                        │
                        └─ propria da fase (1:N)


EXEMPLO REAL:
─────────────

Usuario: Vicente (id=1, role=admin)
    │
    └─ Criou Projeto "Casa Vila Mariana" (id=101)
            │
            ├─ Fase "Fundação" (ordem=1)
            │   ├─ Atividade "Escavação" (responsavel=João)
            │   ├─ Atividade "Concreto" (responsavel=Pedro)
            │   └─ Material "Cimento" (1000 kg × R$1.50 = R$1.500)
            │
            ├─ Fase "Estrutura" (ordem=2)
            │   ├─ Atividade "Armação de aço"
            │   └─ Material "Aço CA-50" (500 kg × R$5.00 = R$2.500)
            │
            └─ Fase "Acabamento" (ordem=3)
                ├─ Atividade "Pintura"
                └─ Material "Tinta" (200 L × R$25.00 = R$5.000)
```

---

## 🔄 Ciclo de Vida de uma Atividade

```
                    ┌─────────────────────┐
                    │   PENDENTE ✗        │
                    │ (Não iniciada)      │
                    └────────┬────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │ EM_PROGRESSO ⚙️       │
                    │ (Responsável trabalhando)
                    └────────┬────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │  CONCLUIDA ✅        │
                    │ (concluida=1)       │
                    └─────────────────────┘

Quando marca como concluída:
- concluida = 1
- status = "concluida"
- Fase % aumenta automaticamente
- Projeto % pode aumentar
```

---

## 📊 Exemplo: Dashboard Atualizado

```
ANTES (getStats Clássico)
┌────────────┬────────────┬────────────┬────────────┐
│ Total: 10  │ Pendentes  │ Em Prog.   │ Concluidas │
│    10      │     3      │     4      │     3      │
└────────────┴────────────┴────────────┴────────────┘

DEPOIS (Dashboard Projetos)
┌────────────┬──────────────┬──────────────┬────────────────┐
│   Projetos │ Em Andamento │ Atividades   │ Materiais      │
│     5      │       2      │ Pendentes: 8 │ Entregues: 23  │
└────────────┴──────────────┴──────────────┴────────────────┘

E em cada projeto:
┌─────────────────────────────────────────┐
│ Casa Vila Mariana                        │
│ 📍 São Paulo, SP                         │
│ Status: Em Andamento                    │
│                                         │
│ Progresso: ████████░░░░░░░░░░░░░░░░░░ │
│           45% Concluído                 │
│                                         │
│ Orçamento: R$ 250.000,00                │
│ Gasto: R$ 112.500,00 (45%)              │
│                                         │
│ [Ver Detalhes] [Editar] [Deletar]       │
└─────────────────────────────────────────┘
```

---

## 🎛️ Hierarquia de Permissões (RBAC)

```
ADMIN (100% acesso)
├─ Criar Projetos ✅
├─ Editar Projetos ✅
├─ Deletar Projetos ✅
├─ Criar Fases ✅
├─ Editar Fases ✅
├─ Deletar Fases ✅
├─ Atualizar Atividades ✅
├─ Ver Relatórios ✅
└─ Gerenciar Usuários ✅

GERENTE (Gerenciar obras)
├─ Criar Projetos ✅
├─ Editar Projetos ✅
├─ Deletar Projetos ✅
├─ Criar Fases ✅
├─ Editar Fases ✅
├─ Deletar Fases ✅
├─ Atualizar Atividades ✅
├─ Ver Relatórios ✅
└─ Gerenciar Usuários ❌

ENGENHEIRO (Técnico)
├─ Criar Projetos ❌
├─ Editar Projetos ❌
├─ Deletar Projetos ❌
├─ Criar Fases ✅
├─ Editar Fases ✅
├─ Deletar Fases ❌
├─ Atualizar Atividades ✅
├─ Ver Relatórios ❌
└─ Gerenciar Usuários ❌

TÉCNICO (Operacional)
├─ Criar Projetos ❌
├─ Editar Projetos ❌
├─ Deletar Projetos ❌
├─ Criar Fases ❌
├─ Editar Fases ❌
├─ Deletar Fases ❌
├─ Atualizar Atividades ✅
├─ Ver Relatórios ❌
└─ Gerenciar Usuários ❌

CLIENTE (Visualizar)
├─ Criar Projetos ❌
├─ Editar Projetos ❌
├─ Deletar Projetos ❌
├─ Criar Fases ❌
├─ Editar Fases ❌
├─ Deletar Fases ❌
├─ Atualizar Atividades ❌
├─ Ver Relatórios ✅ (seus projetos)
└─ Gerenciar Usuários ❌
```

---

## 🚀 Stack de Tecnologias (Camadas)

```
APRESENTAÇÃO
└─ Web: HTML5/CSS3 + JS Vanilla
└─ Mobile: React Native + Expo
└─ Desktop: Electron (opcional futuro)

APLICAÇÃO
└─ Node.js + Express.js
└─ Routes (./routes.js)
└─ Controllers (./controllers.js, ./projectControllers.js)
└─ Middleware (JWT, CORS)

LÓGICA DE NEGÓCIO
└─ Validações
└─ Cálculos de orçamento
└─ Rastreamento de progresso
└─ Regras de acesso (RBAC)

DADOS
└─ SQLite3 (./tasks.db)
└─ Schema com 7 tabelas
└─ Relacionamentos 1:N
└─ Integridade referencial
```

---

**Último Update:** 25 de Março de 2026  
**Versão:** 2.0
