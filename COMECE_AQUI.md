# 🚀 COMECE AQUI - Sistema Pronto!

## ⚡ 3 Passos Para Funcionar

### Passo 1: Instalar Node.js
Baixe em: https://nodejs.org/ (use versão LTS 18+)

Após instalar, verifique:
```bash
node --version
npm --version
```

---

### Passo 2: Iniciar Backend (Terminal/Prompt)

```bash
cd /home/vicente/Área\ de\ trabalho/Gerenciador-de-tarefas_2.0/backend
npm install
npm run dev
```

**Esperado ver:**
```
✓ SQLite conectado
✓ Usuário criado: vicentedesouza762@gmail.com (admin)
...
🚀 Servidor rodando em http://localhost:5000
```

**✅ DEIXE RODANDO!** Não feche este terminal.

---

### Passo 3: Abrir no Navegador

Abra um navegador (Chrome, Firefox, Edge) e acesse:
```
/home/vicente/Área de trabalho/Gerenciador-de-tarefas_2.0/web/index-novo.html
```

Ou se preferir, use um servidor local (outro terminal):
```bash
cd /home/vicente/Área\ de\ trabalho/Gerenciador-de-tarefas_2.0/web
python3 -m http.server 8000
```

Depois abra: `http://localhost:8000/index-novo.html`

---

## 🔑 Faça Login

Use qualquer conta:
```
Email: vicentedesouza762@gmail.com
Senha: Admin@2026
```

---

## ✨ O Que Você Verá

```
┌─────────────────────────────────────────┐
│  Dashboard                              │
│  [Logo] [Navegação] [Seu Email] [Sair] │
├─────────────────────────────────────────┤
│                                         │
│  📊 5 Projetos   ⚙️ 2 Em And.  ✅ 8 Pend. │
│  📦 23 Materiais                        │
│                                         │
│  [+ Novo Projeto] [Projetos] [Ativ.] │
│                                         │
│  Casa Vila Mariana                      │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░ 45% │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎮 Tente Isso

1. **Clique em "Novo Projeto"**
   - Preencha nome, localização, tipo
   - Clique "Criar Projeto"
   - Projeto aparece na lista!

2. **Clique em "Materiais"**
   - Clique "+ Novo Material"
   - Preencha dados
   - Clique "Adicionar Material"

3. **Explore "Atividades"**
   - Veja lista de tarefas pendentes
   - Veja status de cada uma

---

## ❓ Dúvidas?

### Erro: "npm: comando não encontrado"
→ Node.js não foi instalado  
→ Baixe em https://nodejs.org/

### Erro: "Conexão recusada"
→ Backend não está rodando  
→ Verifique se Terminal 1 ainda está aberto

### Página em branco
→ Abra F12 (ferramentas de dev)  
→ Veja abas "Console" e "Network"
→ Procure mensagens de erro

### "API não responde"
→ Certifique-se que backend está em http://localhost:5000
→ Verifique firewall/antivírus

---

## 📚 Próximo: Ler Documentação

Depois que tudo está funcionando, **leia em ordem**:

1. **QUICKSTART.md** (5 min) - Overview rápido
2. **README.md** (10 min) - Informações completas  
3. **REFACTORING_SUMMARY.md** (15 min) - O que foi feito
4. **DEVELOPMENT_GUIDE.md** (20 min) - Próximas features

---

## 🆘 Precisa Resetar?

Se algo der errado, delete o banco:
```bash
cd backend
rm tasks.db
npm run dev
```

O banco será recriado automaticamente com dados de teste.

---

## ✅ Checklist - Sistema OK?

- [ ] Node.js instalado
- [ ] Backend rodando (Terminal tem "Servidor rodando")
- [ ] Frontend abre (página com logo aparece)
- [ ] Login funciona (dashboard aparece)
- [ ] Vê 4 números no dashboard
- [ ] "+ Novo Projeto" abre modal
- [ ] Consegue criar projeto

**Tudo marcado?** 🎉 **Sistema Pronto!**

---

## 📁 Arquivos Importantes

Se quiser **editar**:

**Mudar cores:**
```
Abra: web/styles-novo.css
Procure: :root { --primary-color: #2c3e50; }
```

**Adicionar novo campo:**
```
Abra: web/index-novo.html
Procure: #projectForm
Adicione novo input
```

**Criar novo endpoint:**
```
1. Abra: backend/projectControllers.js
2. Adicione function nova
3. Abra: backend/routes.js
4. Adicione rota nova
```

---

## 🎯 Você Tem Agora

✅ Sistema profissional de gerenciamento de projetos  
✅ Banco de dados estruturado  
✅ API REST funcional  
✅ Interface web responsiva  
✅ Autenticação JWT  
✅ Documentação completa  

---

**Vamos começar?** 🚀

Siga os 3 passos acima e começa a usar!

---

**Versão:** 2.0  
**Data:** 25/03/2026  
**Status:** ✅ Pronto Para Usar
