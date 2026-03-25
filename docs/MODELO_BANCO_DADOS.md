# MODELO ENTIDADE-RELACIONAMENTO (ER)

## Diagrama Conceitual

```
┌─────────────────────┐
│    USUARIOS         │
├─────────────────────┤
│ PK id               │
│ email (UNIQUE)      │
│ nome                │
│ senha (HASH)        │
│ role                │
│ criado_em           │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│    TAREFAS          │
├─────────────────────┤
│ PK id               │
│ titulo              │
│ descricao           │
│ FK usuario_id       │
│ categoria           │
│ status              │
│ prioridade          │
│ data_vencimento     │
│ concluida           │
│ criado_em           │
│ atualizado_em       │
└─────────────────────┘
```

## Tuplas Exemplo

### USUARIOS
| id | email | nome | role | criado_em |
|----|-------|------|------|-----------|
| 1 | vicentedesouza762@gmail.com | Vicente de Souza | admin | 2026-03-24 |
| 2 | francisco@projeto.com | Francisco Silva | admin | 2026-03-24 |
| 3 | gerenteteste@projeto.com | Gerente Teste | gerente | 2026-03-24 |

### TAREFAS
| id | titulo | descricao | usuario_id | categoria | status | prioridade | concluida |
|----|--------|-----------|------------|-----------|--------|------------|-----------|
| 1 | Estudar Node.js | Estudar autenticação JWT | 1 | estudo | pendente | alta | 0 |
| 2 | Bug no login | Corrigir validação email | 2 | trabalho | em_progresso | alta | 0 |
| 3 | Almoço com cliente | Reunião confirmada | 3 | trabalho | concluida | media | 1 |

---

**Criado em:** 24/03/2026  
**Versão:** 1.0
