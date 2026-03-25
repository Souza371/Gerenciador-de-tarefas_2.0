# 🚀 COMEÇAR TESTES AQUI

## 📌 Resumo Executivo

Seu sistema está **100% pronto para testes**! Foram criados 4 arquivos especializados para guiá-lo:

| Arquivo | Propósito | Leia Quando |
|---------|-----------|-------------|
| **GUIA_GITHUB_CODESPACES.md** | Passo-a-passo detalhado no Codespaces | ⭐ COMECE AQUI |
| **PLANO_TESTES_COMPLETO.md** | Plano abrangente (12 seções de testes) | Depois do Codespaces |
| **testes_automatizados.sh** | Script que testa todo o sistema | Depois que o backend rodar |
| **REGISTRO_TESTES.md** | Formulário para documentar resultados | Durante/Depois dos testes |

---

## ⚡ Quick Start (3 passos)

### 1️⃣ Abrir GitHub Codespaces (2-3 min)
```
Vá para: https://github.com/Souza371/Gerenciador-de-tarefas_2.0
Clique: Green "Code" → Codespaces → "Create codespace on main"
```

### 2️⃣ Instalar e Rodar Backend (2-3 min)
```bash
cd backend
npm install
npm run dev
```

Você verá:
```
✓ SQLite conectado com sucesso
7 usuários padrão criados
🚀 Servidor rodando em http://localhost:5000
```

### 3️⃣ Acessar Frontend (1 min)
1. Abra novo terminal (clique **"+"** em Terminal)
2. Execute:
```bash
cd ../web
python3 -m http.server 8000
```
3. Clique em Ports (próximo à aba Terminal)
4. Clique no ícone de "abrir em navegador" da porta 8000

---

## 🎯 Contas de Teste (Login)

Use qualquer uma dessas 7 contas pré-configuradas:

```javascript
// Admin - Acesso total
Email: admin@construtora.com
Senha: Admin@2026

// Gerente - Cria projetos
Email: gerente@construtora.com  
Senha: Gerente@2026

// Engenheiro - Cria atividades
Email: eng.silva@construtora.com
Senha: Eng@2026

// Técnico - Atualiza status
Email: tecnico@construtora.com
Senha: Tecnico@2026

// Cliente - Acesso limitado
Email: cliente@construtora.com
Senha: Cliente@2026

// Supervisor - Relatórios
Email: supervisor@construtora.com
Senha: Supervisor@2026

// Contador - Financeiro
Email: contador@construtora.com
Senha: Contador@2026
```

---

## 📊 O que Testar

### ✅ Dashboard (KPIs)
- [ ] Total de Projetos
- [ ] Projetos em Andamento
- [ ] Taxa de Conclusão Média
- [ ] Total de Gastos

### ✅ Projetos (CRUD)
- [ ] Criar novo projeto
- [ ] Editar projeto
- [ ] Deletar projeto
- [ ] Ver lista completa

### ✅ Atividades
- [ ] Marcar como concluída
- [ ] Alterar status
- [ ] Ver todas as atividades
- [ ] Responsável aparece corretamente

### ✅ Materiais
- [ ] Adicionar material
- [ ] Valor total calcula (quantidade × preço unitário)
- [ ] Deletar material
- [ ] Lista correta

### ✅ Controle de Acesso
- [ ] Admin vê tudo
- [ ] Cliente acesso limitado
- [ ] Cada perfil tem permissões certos

### ✅ Responsividade
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)  
- [ ] Mobile (375x812)

---

## 🤖 Testes Automatizados

Depois que o backend estiver rodando, em um **novo terminal** (terceiro):

```bash
cd backend
bash testes_automatizados.sh
```

O script vai:
- ✅ Verificar Node.js/npm
- ✅ Conectar ao backend
- ✅ Testar login (todos os perfis)
- ✅ Testar criar/editar/deletar
- ✅ Testar API endpoints
- ✅ Verificar permissões
- ✅ Medir performance
- 📊 Gerar relatório final

**Esperado:** "🎉 TODOS OS TESTES PASSARAM!"

---

## 📋 Documentar Resultados

Abra `REGISTRO_TESTES.md` e preencha:

```markdown
Data: 25 de março de 2026
Testador: [Seu nome]
Ambiente: [x] Codespaces

[Preencher cada seção com seus resultados]
```

Quando terminar, você terá um documento profissional para anexar ao projeto! 📄

---

## 🔗 Links Importantes

| Recurso | URL |
|---------|-----|
| GitHub Repo | https://github.com/Souza371/Gerenciador-de-tarefas_2.0 |
| Backend API | http://localhost:5000 (quando rodando) |
| Frontend Web | http://localhost:8000 (quando rodando) |
| Codespaces | https://github.com/codespaces |

---

## 💡 Dicas Importantes

### Terminal do Codespaces
- **CTRL + `** = Abrir/fechar terminal
- **CTRL + Shift + `** = Novo terminal
- **+** no painel = Novo terminal
- A cor da aba terminal muda por terminal

### Portas Abertas
- **5000** = Backend (Node.js)
- **8000** = Frontend (Python http.server)

### Se algo não funcionar
1. Verifique se ambas as portas estão abertas (aba Ports)
2. Verifique se não há erro nos terminais
3. Recarregue a página (F5 no navegador)
4. Reinicie o backend (Ctrl+C, depois `npm run dev`)

---

## 🎓 Estrutura de Testes Detalhada

Se você quer mais detalhes, leia:

1. **Começar** → GUIA_GITHUB_CODESPACES.md (passo-a-passo)
2. **Aprofundar** → PLANO_TESTES_COMPLETO.md (12 seções completas)
3. **Sistematizar** → REGISTRO_TESTES.md (documento profissional)
4. **Automatizar** → testes_automatizados.sh (script bash)

---

## ✨ O que Esperar Após os Testes

Você terá:

✅ Sistema completamente testado
✅ Documento de testes preenchido
✅ Relatório de erros (se houver)
✅ Confirmação de funcionalidades
✅ Evidência de qualidade do código

Isso é **excelente para um Projeto Integrador Final**! 🏆

---

## 🚀 Próximos Passos (Depois dos Testes)

1. ✅ Preencher `REGISTRO_TESTES.md` com resultados
2. ✅ Fazer push no GitHub (commit + push)
3. ✅ Preparar apresentação com screenshots
4. ✅ Documentar qualquer bug encontrado
5. ✅ Criar README final para entrega

---

## 📞 Precisa de Ajuda?

Todos os documentos têm:
- ✅ Instruções passo-a-passo
- ✅ Exemplos práticos com curl
- ✅ Troubleshooting para erros
- ✅ Screenshots do que esperar

**Comece pelo GUIA_GITHUB_CODESPACES.md - está bem detalhado!** 👇

---

**Sistema v2.0 - Gerenciador de Projetos para Construção Civil** 🏗️  
Commit: ad0167b | Timestamp: 25 de março de 2026
