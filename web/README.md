# Frontend Web - Gerenciador de Tarefas 2.0

## 🚀 Como Executar

### Opção 1: VS Code Live Server
1. Abra a pasta `/web` no VS Code
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"
4. Navegador abrirá em `http://localhost:5500` ou `http://127.0.0.1:5500`

### Opção 2: Python HTTP Server
```bash
cd web
python -m http.server 8000
# Acesse: http://localhost:8000
```

### Opção 3: Node HTTP Server
```bash
npm install -g http-server
cd web
http-server -p 8000
```

## 📋 Usuários de Teste

| Email | Senha |
|-------|-------|
| vicentedesouza762@gmail.com | Admin@2026 |
| francisco@projeto.com | Admin@2026 |
| gerenteteste@projeto.com | Gerente@123 |
| clienteteste@projeto.com | Cliente@123 |

## ✨ Funcionalidades

✅ Login/Logout seguro  
✅ CRUD completo de tarefas  
✅ Filtros (Status, Categoria, Prioridade)  
✅ Pesquisa em tempo real  
✅ Dashboard com estatísticas  
✅ Modal para criar/editar tarefas  
✅ Responsive (mobile, tablet, desktop)  

## 🎨 Estrutura

```
web/
├── index.html  → Estrutura HTML
├── styles.css  → Estilos responsivos
├── app.js      → Lógica JavaScript
└── README.md   → Este arquivo
```

## 🔗 Dependências

Nenhuma dependência externa! Usa apenas:
- HTML5
- CSS3
- JavaScript Vanilla
- Fetch API

## ⚙️ Configuração

Certifique-se de que o **backend está rodando em `http://localhost:5000`**

A API é chamada em `app.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

Se mudar a porta do backend, atualize a variável.

## 🧪 Testes

1. **Login**: Use um dos usuários de teste acima
2. **Criar Tarefa**: Clique em "+ Nova Tarefa"
3. **Editar**: Clique em "✎ Editar" no card
4. **Deletar**: Clique em "🗑 Deletar"
5. **Concluir**: Clique em "✓ Concluir"
6. **Filtrar**: Use os botões na sidebar
7. **Pesquisar**: Digite no campo "Pesquisar tarefas..."

## 📱 Responsividade

- **Desktop**: Layout com sidebar + main content
- **Tablet (768px)**: Sidebar desaparece
- **Mobile (320px)**: Tudo empilhado verticalmente

## 🚀 Deploy

Para colocar em produção:

1. Build (não precisa, é puro HTML)
2. Upload para qualquer hosting (Netlify, GitHub Pages, Vercel)
3. Configurar CORS no backend para aceitar requisições de outro domínio

---

**Desenvolvido com ❤️ por Vicente de Souza**
