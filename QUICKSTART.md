# ⚡ Quick Start - Gerenciador de Projetos v2.0

## 🏃 Começar em 5 Minutos

### Pré-requisito Único
Instale Node.js 18+: https://nodejs.org/

---

## 1️⃣ Terminal A - Instalar Backend

```bash
cd /home/vicente/Área\ de\ trabalho/Gerenciador-de-tarefas_2.0/backend
npm install
npm run dev
```

**Esperado:** 
```
✓ SQLite conectado
✓ Usuário criado: vicentedesouza762@gmail.com (admin)
✓ Usuário criado: francisco@projeto.com (admin)
...
🚀 Servidor rodando em http://localhost:5000
```

---

## 2️⃣ Navegador - Abrir Frontend

Abra este arquivo no navegador:
```
/home/vicente/Área de trabalho/Gerenciador-de-tarefas_2.0/web/index-novo.html
```

Ou use um servidor local (Terminal B):
```bash
cd /home/vicente/Área\ de\ trabalho/Gerenciador-de-tarefas_2.0/web
python3 -m http.server 8000

# Acesse: http://localhost:8000/index-novo.html
```

---

## 3️⃣ Testar

### Login com qualquer conta:
```
Email: vicentedesouza762@gmail.com
Senha: Admin@2026
```

### Experimentar:
1. **Dashboard** - Veja os 4 KPIs
2. **Projetos** - Clique "+ Novo Projeto"
3. **Atividades** - Lista de tarefas
4. **Materiais** - Clique "+ Novo Material"

---

## 🐛 Se der erro...

### "npm: comando não encontrado"
→ Node.js não está instalado  
→ Baixe em https://nodejs.org/  
→ Reinicie o terminal

### "Conexão recusada"
→ Backend não está rodando  
→ Execute `npm run dev` no Terminal A

### "Modalidade com branco"
→ Banco de dados pode estar corrompido  
→ Delete `tasks.db` na pasta backend e reinicie

---

## 📁 Arquivos Importantes

```
web/
├── index-novo.html    ← Abra este arquivo
├── styles-novo.css    ← Estilos (editar aqui para mudar aparência)
└── app-novo.js        ← Lógica (editar aqui para novas funcionalidades)

backend/
├── database.js        ← Estrutura do banco (editar se adicionar tabelas)
├── routes.js          ← Endpoints API (onde adicionar novos endpoints)
└── projectControllers.js ← Lógica da API
```

---

## 🔑 Contas de Teste Disponíveis

| Email | Senha | Acesso |
|-------|-------|--------|
| vicentedesouza762@gmail.com | Admin@2026 | Admin ✅ |
| gerenteteste@projeto.com | Gerente@123 | Gerente ✅ |
| engenheiroteste@projeto.com | Engenheiro@123 | Engenheiro ✅ |
| tecnicoteste@projeto.com | Tecnico@123 | Técnico ✅ |
| clienteteste@projeto.com | Cliente@123 | Cliente ✅ |

---

## 📊 Verificar se Tudo Funciona

**Terminal 1 rodando? Procure por:**
```
✓ SQLite conectado
🚀 Servidor rodando em http://localhost:5000
```

**Navegador funcionando? Tente:**
```javascript
// F12 (Ferramentas de Desenvolvedor) → Console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ API:', d))
```

---

## 🎨 Customizar Interface

### Mudar cores
Abra `web/styles-novo.css` e procure por `:root`:
```css
:root {
  --primary-color: #2c3e50;  ← Cor principal
  --secondary-color: #3498db; ← Cor secundária
  ...
}
```

### Adicionar novo campo no formulário
Abra `web/index-novo.html` e procure `#projectForm`:
```html
<div class="form-group full">
  <label>Seu novo campo</label>
  <input type="text" name="meu_campo" placeholder="...">
</div>
```

---

## ✅ Checklist - Sistema Funcionando?

- [ ] Terminal mostra "Servidor rodando"
- [ ] Página carrega sem branco
- [ ] Login funciona
- [ ] Dashboard mostra 4 números
- [ ] Botão "+ Novo Projeto" abre modal
- [ ] Consegue criar projeto
- [ ] Consegue ver projetos listados

Se tudo está marcado: **🎉 Sistema pronto!**

---

## 📚 Próximo: Ler Documentação Completa

1. **README.md** - Overview do projeto
2. **REFACTORING_SUMMARY.md** - Tudo o que foi feito  
3. **docs/BRIEFING_REQUISITOS.md** - Requisitos originais

---

## 🚨 Precisa de Ajuda?

1. Verifique a seção "Troubleshooting" no README.md
2. Veja os logs do Terminal A (pode ter dica do erro)
3. Abra F12 no navegador → Console (procure erros de rede)

---

**Última atualização:** 25 de Março de 2026  
**Versão:** 2.0
