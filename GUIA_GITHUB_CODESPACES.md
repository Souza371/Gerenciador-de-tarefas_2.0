# GUIA: Como Usar GitHub Codespaces para Testar o Sistema

## 📋 Pré-Requisitos
- ✅ Conta GitHub com acesso ao repositório
- ✅ Email Senac (você tem GitHub Pro grátis!)
- ✅ Browser atualizado

---

## 🚀 PASSO 1: Abrir GitHub Codespaces (2-3 minutos)

### Opção A - Direto pelo Botão (Mais Rápido)

1. Vá para: https://github.com/Souza371/Gerenciador-de-tarefas_2.0

2. Clique no botão verde **"Code"** (à direita, no topo do repositório)

3. Abra a aba **"Codespaces"**

4. Clique em **"Create codespace on main"**

5. Aguarde 1-2 minutos enquanto o ambiente é criado

6. Você verá o **VS Code no navegador** abrir automaticamente ✨

### Opção B - Pela Interface Web

1. https://github.com/codespaces

2. Clique em **"New codespace"**

3. Repository: `Souza371/Gerenciador-de-tarefas_2.0`

4. Branch: `main`

5. Dev container config: deixe padrão

6. Clique em **"Create codespace"**

---

## ⏳ Durante Criação (O que você verá)

```
Setting up your codespace...
[████████░░░░░░░░░░░░░░░] 35%

Installing extensions...
[████████████████████████] 100%

Your codespace is ready!
```

✅ Clique em **"Open in VS Code for Web"** quando terminar

---

## 💻 PASSO 2: Terminal no Codespaces

Você verá o VS Code aberto com o código do projeto. Para abrir o terminal:

### 2.1 Abrir Terminal
- Pressione **CTRL + `** (crase, backtick)

OU

- Menu → View → Terminal

OU

- Clique em "Terminal" na barra inferior

### 2.2 Usando o Terminal
O terminal já começa no diretório raiz do projeto. Você verá algo como:

```
@seu-usuario ➜ /workspaces/Gerenciador-de-tarefas_2.0 (main) $
```

---

## 🔧 PASSO 3: Instalar Dependências (2-3 minutos)

No terminal, execute:

```bash
cd backend
npm install
```

Você verá:
```
npm WARN deprecated <alguns avisos>
added 87 packages in 2.5s
```

⚠️ **Aviso:** ignore os mensagens "WARN deprecated" - são normais

✅ **Sucesso:** quando terminar, não há erros vermelhos

---

## 🚀 PASSO 4: Iniciar o Backend (1-2 minutos)

No mesmo terminal (ainda em `backend/`), execute:

```bash
npm run dev
```

Você verá:

```
✓ SQLite conectado com sucesso
7 usuários padrão criados
🚀 Servidor rodando em http://localhost:5000
```

✅ **Perfeito!** O backend está rodando

⚠️ **Importante:** Deixe este terminal aberto! O servidor precisa continuar rodando.

---

## 🌐 PASSO 5: Acessar o Frontend

### 5.1 Abrir Novo Terminal

No VS Code (Codespaces), abra outro terminal:

- Clique no **"+"** no painel de terminal inferior

OU

- Pressione **CTRL + SHIFT + `**

### 5.2 Navegar para a Pasta Web

```bash
cd ../web
```

### 5.3 Iniciar um Servidor Simples

```bash
python3 -m http.server 8000
```

Você verá:

```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)
```

---

## 🎮 PASSO 6: Acessar a Interface Web

### Opção A - Codespaces Port Forwarding (Recomendado)

1. No VS Code, clique na aba **"Ports"** (próximo à aba Terminal)

2. Você deve ver:
   - **5000** (Backend) - node-express
   - **8000** (Frontend) - python http.server

3. Clique com botão direito na porta **8000** e selecione **"Open in Browser"**

4. 🎉 Você verá a página de **LOGIN**

### Opção B - URL Direta

Se não vir a aba Ports, copie uma dessas URLs:

- **http://localhost:8000** (Frontend)
- **http://localhost:5000** (Backend API)

Pode ser que o Codespaces gere URLs como:
- `https://seu-username-gerenciador-4j25.github.dev:8000`
- `https://seu-username-gerenciador-4j25.github.dev:5000`

---

## 🔐 PASSO 7: Fazer Login (Teste com Conta Admin)

Na página de login, insira:

```
Email: admin@construtora.com
Senha: Admin@2026
```

Clique em **"Entrar"**

✅ **Esperado:** Você será redirecionado para o **DASHBOARD**

---

## 📊 PASSO 8: Testar o Dashboard

Você deve ver **4 cards** mostrando:

1. **Total de Projetos** (número)
2. **Projetos em Andamento** (número)
3. **Taxa de Conclusão Média** (%)
4. **Total de Gastos** (R$)

✅ Se vir os 4 cards, o sistema está **funcionando perfeitamente!**

---

## 📝 PASSO 9: Testar Outras Funcionalidades

### No topo da página, clique em:

#### ✅ Projetos
- Botão "Novo Projeto" abre modal?
- Consegue criar um projeto?
- Consegue editar?
- Consegue deletar?

#### ✅ Atividades
- Consegue ver atividades?
- Consegue marcar como concluída?
- Consegue filtrar por status?

#### ✅ Materiais
- Consegue adicionar material?
- Valor total calcula automaticamente?
- Consegue deletar?

#### ✅ Logout
- Clique em "Sair" no canto superior direito
- Você retorna para a página de login?
- Token foi removido?

---

## 🧪 PASSO 10: Testar com Outros Perfis

Faça logout e teste com outra conta:

### Gerente
```
Email: gerente@construtora.com
Senha: Gerente@2026
```

### Engenheiro
```
Email: eng.silva@construtora.com
Senha: Eng@2026
```

### Técnico
```
Email: tecnico@construtora.com
Senha: Tecnico@2026
```

### Cliente
```
Email: cliente@construtora.com
Senha: Cliente@2026
```

✅ Verifique se cada perfil vê **funcionalidades diferentes**

---

## 🔬 PASSO 11: Testar API com CURL (Avançado)

Se quiser testar endpoints específicos:

### 11.1 Abrir Terminal (terceiro)

- Clique em **"+"** novamente no painel Terminal

### 11.2 Fazer Login e Pegar Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@construtora.com",
    "senha": "Admin@2026"
  }' | jq .
```

Você verá algo como:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@construtora.com",
    "role": "admin"
  }
}
```

### 11.3 Copiar o Token

Copie o valor de `"token"` (toda aquela string longa)

### 11.4 Usar Token para Testar Rotas

```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" | jq .
```

**Resultado esperado:**
```json
{
  "total_projetos": 0,
  "projetos_em_andamento": 0,
  "taxa_conclusao_media": 0,
  "total_gastos": 0
}
```

---

## 🐛 Ficou com Problema? Troubleshooting

### Se der erro 404 no Frontend
- Verifique se está acessando `http://localhost:8000`
- Verifique se o servidor Python está rodando
- Verifique se há arquivo `index-novo.html` em `web/`

### Se o Backend não conectar
- Verifique se `http://localhost:5000` responde
- Verifique se há erro no terminal do backend
- Tente reiniciar: CTRL+C no backend, depois `npm run dev` novamente

### Se o login falhar
- Verifique se o email está correto (sem espaços)
- Verifique se a senha está correta
- Verifique no console do navegador (F12) se há erro

### Se conseguir dar erro de CORS
- Já está configurado no backend
- Verifique se está acessando de um endereço diferente
- Reinicie ambos os servidores

---

## 📋 Checklist de Testes Concluídos

Quando terminar, preencha:

```
✅ GitHub Codespaces aberto
✅ npm install executado
✅ Backend rodando em localhost:5000
✅ Frontend acessível em localhost:8000
✅ Login funciona
✅ Dashboard mostra 4 KPIs
✅ Testei seção de Projetos
✅ Testei seção de Atividades
✅ Testei seção de Materiais
✅ Testei logout
✅ Testei com múltiplos perfis
✅ Testei API com curl
```

---

## 🎯 Próximas Etapas

Quando tudo funcionar:

1. Tire **print do dashboard** para seu portfólio
2. Teste em **dispositivo mobile** (se possível)
3. Documente tudo em **TESTES_REALIZADOS.md**
4. Faça **commit no GitHub** com resultado dos testes

---

## ℹ️ Dúvidas Frequentes

**P: Posso fechar o Codespaces e voltar depois?**  
R: Sim! Vá em https://github.com/codespaces e clique no seu codespace

**P: Posso rodar frontend sem Python?**  
R: Sim, pode usar `npx http-server` também

**P: Como vejo os logs do banco de dados?**  
R: Está no console do backend. Use `npm run dev` para modo verbose

**P: Preciso de Postman para testar?**  
R: Não, curl funciona. Mas Postman é mais visual.

