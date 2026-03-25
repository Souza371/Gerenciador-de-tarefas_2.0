# 📋 REGISTRO DE TESTES REALIZADOS

**Data:** _________________  
**Testador:** _________________  
**Ambiente:** [ ] Local [ ] Codespaces [ ] Outro: _________

---

## ✅ CONFIGURAÇÃO E AMBIENTE

### Dependências Instaladas
- [ ] Node.js versão: ________
- [ ] npm versão: ________
- [ ] Todas as dependências do npm instaladas
- [ ] Sem erros durante npm install

### Backend Rodando
- [ ] Servidor iniciado em http://localhost:5000
- [ ] Mensagem: "✓ SQLite conectado com sucesso"
- [ ] Mensagem: "7 usuários padrão criados"
- [ ] Banco de dados criado corretamente

### Frontend Acessível
- [ ] Página de login carrega em http://localhost:8000
- [ ] Interface responsiva (testado em mobile/tablet/desktop)
- [ ] Sem erros no console do navegador

---

## 🔐 AUTENTICAÇÃO

### Login Admin
- [ ] Email: admin@construtora.com
- [ ] Senha: Admin@2026
- [ ] ✓ Login bem-sucedido
- [ ] ✓ Token gerado e armazenado
- [ ] ✓ Redirecionado para dashboard

### Login com Credenciais Inválidas
- [ ] Rejeita senha incorreta
- [ ] Rejeita email inexistente
- [ ] Exibe mensagem de erro apropriada
- [ ] Não gera token

### Logout
- [ ] Botão "Sair" remove token
- [ ] Redireciona para login
- [ ] localStorage limpo

---

## 📊 DASHBOARD

### Cards Exibidos
- [ ] Card 1: Total de Projetos
  - Valor esperado: _____
  - Valor obtido: _____
  - ✓ Correto

- [ ] Card 2: Projetos em Andamento
  - Valor esperado: _____
  - Valor obtido: _____
  - ✓ Correto

- [ ] Card 3: Taxa de Conclusão Média (%)
  - Valor esperado: _____
  - Valor obtido: _____
  - ✓ Correto

- [ ] Card 4: Total de Gastos (R$)
  - Valor esperado: _____
  - Valor obtido: _____
  - ✓ Correto

### Responsividade
- [ ] Desktop (1920x1080): OK
- [ ] Tablet (768x1024): OK
- [ ] Mobile (375x812): OK
- [ ] Layouts adaptam corretamente

---

## 📁 PROJETOS - CRUD

### Criar Projeto
- [ ] Modal abre ao clicar "Novo Projeto"
- [ ] Campos validados:
  - [ ] Nome obrigatório
  - [ ] Descrição obrigatória
  - [ ] Localização obrigatória
  - [ ] Tipo selecionável
  - [ ] Orçamento numérico
- [ ] Projeto criado com sucesso
- [ ] Grid atualiza automaticamente
- [ ] Nova linha aparece na lista
- Teste:
  - Nome: _________________________
  - Descrição: _________________________
  - Localização: _________________________
  - Resultado: ✓ SUCESSO

### Listar Projetos
- [ ] Todos os projetos exibidos
- [ ] Cards mostram:
  - [ ] Nome do projeto
  - [ ] Localização
  - [ ] Status
  - [ ] Orçamento
  - [ ] Percentual de conclusão

### Editar Projeto
- [ ] Clique em editar abre modal
- [ ] Campos pré-preenchidos corretamente
- [ ] Alterações salvam
- [ ] Lista atualiza
- Teste:
  - Campo alterado: _________________________
  - Novo valor: _________________________
  - Resultado: ✓ SUCESSO

### Deletar Projeto
- [ ] Botão delete funciona
- [ ] Confirmação solicitada
- [ ] Projeto removido da lista
- [ ] Banco de dados atualizado
- Teste:
  - Projeto: _________________________
  - Resultado: ✓ DELETADO

---

## 📋 ATIVIDADES

### Criar Atividade
- [ ] Atividades aparecem em lista
- [ ] Faz POST para /api/atividades
- [ ] Campos:
  - [ ] Título obrigatório
  - [ ] Status selecionável
  - [ ] Responsável atribuído
  - [ ] Prioridade selecionável
  - [ ] Data vencimento

### Listar Atividades
- [ ] Exibe várias atividades
- [ ] Mostra status (a fazer/em progresso/concluída)
- [ ] Responsável visível
- [ ] Data vencimento exibida
- [ ] Prioridade indicada (cores diferentes)

### Gerenciar Status
- [ ] Mudança para "em_progresso": ✓
- [ ] Mudança para "concluida": ✓
- [ ] Status atualiza no backend
- [ ] Interface reflete mudança

### Marcar como Concluída
- [ ] Checkbox ou botão funciona
- [ ] Campo "concluida" atualiza
- [ ] Visual muda (ex: strikethrough)
- [ ] Conta para percentual do projeto

---

## 📦 MATERIAIS

### Criar Material
- [ ] Modal "Adicionar Material" abre
- [ ] Campos:
  - [ ] Nome obrigatório
  - [ ] Quantidade numérica
  - [ ] Unidade selecionável
  - [ ] Valor unitário (R$)
- [ ] Cálculo automático: valor_total = quantidade × valor_unitario
- [ ] Material aparece na lista

### Listar Materiais
- [ ] Todos os materiais exibidos
- [ ] Colunas: Nome, Quantidade, Unidade, Valor Unit., Valor Total
- [ ] Totais calculados corretamente

### Deletar Material
- [ ] Botão delete funciona
- [ ] Material removido
- [ ] Valor total recalculado

### Cálculos Financeiros
- Material: Cimento
  - Quantidade: 100
  - Unidade: sacos
  - Valor unitário: R$ 25,50
  - Valor total esperado: R$ 2.550,00
  - Valor total obtido: R$ _______
  - ✓ Correto

---

## 🔐 CONTROLE DE ACESSO (RBAC)

### Admin
- [ ] Acessa dashboard: ✓
- [ ] Cria projetos: ✓
- [ ] Edita projetos: ✓
- [ ] Deleta projetos: ✓
- [ ] Acessa financeiro: ✓

### Gerente
- [ ] Acessa dashboard: ✓
- [ ] Cria projetos: ✓
- [ ] Edita projetos: ✓
- [ ] Deleta projetos: ❌
- [ ] Acessa financeiro: ❌

### Engenheiro
- [ ] Acessa dashboard: ✓
- [ ] Cria atividades: ✓
- [ ] Edita atividades: ✓
- [ ] Deleta projetos: ❌

### Técnico
- [ ] Vê atividades atribuídas: ✓
- [ ] Atualiza status: ✓
- [ ] Cria projetos: ❌

### Cliente
- [ ] Vê apenas seus projetos: ✓
- [ ] Edita: ❌
- [ ] Deleta: ❌

---

## 🔗 ENDPOINTS API

### Autenticação
```
POST /api/auth/login
Status: [ ] 200  [ ] Erro
Response tem token: [ ] Sim [ ] Não
```

### Projetos
```
GET /api/projetos
Status: [ ] 200  [ ] Erro
Array retornado: [ ] Sim [ ] Não
Número de projetos: ____

POST /api/projetos
Status: [ ] 201  [ ] Erro
Novo ID: ____

PUT /api/projetos/1
Status: [ ] 200  [ ] Erro

DELETE /api/projetos/1
Status: [ ] 200  [ ] Erro
```

### Atividades
```
GET /api/atividades
Status: [ ] 200  [ ] Erro
Número de atividades: ____

POST /api/atividades
Status: [ ] 201  [ ] Erro

PUT /api/atividades/1
Status: [ ] 200  [ ] Erro
```

### Materiais
```
GET /api/materiais
Status: [ ] 200  [ ] Erro
Número de materiais: ____

POST /api/materiais
Status: [ ] 201  [ ] Erro

DELETE /api/materiais/1
Status: [ ] 200  [ ] Erro
```

### Dashboard
```
GET /api/dashboard
Status: [ ] 200  [ ] Erro
Retorna KPIs: [ ] Sim [ ] Não
```

---

## ⚡ PERFORMANCE

### Tempo de Resposta
- [ ] GET /dashboard < 500ms: Tempo real: _____ms
- [ ] GET /projetos < 500ms: Tempo real: _____ms
- [ ] POST /projetos < 1s: Tempo real: _____ms

### Uso de Memória
- [ ] Backend inicia com ~50MB
- [ ] Após 100 requisições: _____MB
- [ ] Sem memory leaks detectados: [ ] Sim [ ] Não

### Responsividade Frontend
- [ ] Dashboard carrega em < 2s
- [ ] Cliques respondem < 200ms
- [ ] Sem travamentos

---

## 🧪 TESTES AUTOMATIZADOS

Executar: `bash backend/testes_automatizados.sh`

```
Data de execução: __________
Tempo total: __________
Testes passados: ____ / ____
Taxa de sucesso: _____%
```

Resultado final:
- [ ] ✅ TODOS OS TESTES PASSARAM
- [ ] ⚠️ Alguns testes falharam

Falhas encontradas:
```
1. _________________________________
2. _________________________________
3. _________________________________
```

---

## 🐛 BUGS ENCONTRADOS

### Bug #1
**Descrição:** _________________________________________________

**Passos para reproduzir:**
1. _________________________________________
2. _________________________________________
3. _________________________________________

**Resultado esperado:** _________________________________

**Resultado obtido:** _________________________________

**Severidade:** [ ] Crítica [ ] Alta [ ] Média [ ] Baixa

**Status:** [ ] Novo [ ] Corrigido [ ] Duplicado

---

### Bug #2
**Descrição:** _________________________________________________

**Passos para reproduzir:**
1. _________________________________________

**Status:** [ ] Novo [ ] Corrigido

---

## 📝 OBSERVAÇÕES E NOTAS

### Pontos Fortes
- ✓ _______________________________________________
- ✓ _______________________________________________
- ✓ _______________________________________________

### Áreas de Melhoria
- ⚠️ _______________________________________________
- ⚠️ _______________________________________________

### Comentários Gerais
___________________________________________________________________

___________________________________________________________________

___________________________________________________________________

---

## ✅ CHECKLIST FINAL

- [ ] Todas as funcionalidades testadas
- [ ] Banco de dados funciona corretamente
- [ ] API responde de forma esperada
- [ ] Frontend responsivo
- [ ] Controle de acesso funcionando
- [ ] Sem erros críticos
- [ ] Sem erros na console
- [ ] Performance aceitável
- [ ] Documentação atualizada
- [ ] Código commitado no GitHub

---

## 📄 ASSINATURA

**Testador:** _________________________________

**Data completado:** _________________________

**Assinatura/Rubrica:** _______________________

**Resultado Final:**
- [ ] ✅ APROVADO - PRONTO PARA ENTREGA
- [ ] ⚠️ APROVADO COM RESSALVAS
- [ ] ❌ REPROVADO - NECESSITA CORREÇÕES

---

## 📞 SUPORTE

Dúvidas durante testes? Consulte:
- GUIA_GITHUB_CODESPACES.md - Instruções passo-a-passo
- PLANO_TESTES_COMPLETO.md - Plano detalhado de testes
- README.md - Documentação do projeto
- DEVELOPMENT_GUIDE.md - Guia para desenvolvedores
