# 📖 Guia de Desenvolvimento & Próximas Features

## 🎯 Estrutura do Código

### Backend: Como Adicionar uma Nova Entidade

Exemplo: Adicionar tabela de **Desenhos/Plantas** do projeto

#### 1. Criar tabela no banco (`backend/database.js`)

```javascript
db.run(`
  CREATE TABLE IF NOT EXISTS desenhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projeto_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    tipo TEXT,  -- planta, corte, fachada, etc
    arquivo_url TEXT,
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
  )
`);
```

#### 2. Adicionar controllers (`backend/projectControllers.js`)

```javascript
export const criarDesenho = (req, res) => {
  const { projeto_id, titulo, tipo, arquivo_url } = req.body;
  
  db.run(
    `INSERT INTO desenhos (projeto_id, titulo, tipo, arquivo_url)
     VALUES (?, ?, ?, ?)`,
    [projeto_id, titulo, tipo, arquivo_url],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao criar desenho' });
      res.status(201).json({ 
        sucesso: true, 
        desenho: { id: this.lastID, projeto_id, titulo }
      });
    }
  );
};

export const listarDesenhos = (req, res) => {
  const { projeto_id } = req.params;
  
  db.all(
    'SELECT * FROM desenhos WHERE projeto_id = ? ORDER BY data_upload DESC',
    [projeto_id],
    (err, desenhos) => {
      if (err) return res.status(500).json({ erro: 'Erro ao listar' });
      res.json(desenhos || []);
    }
  );
};

export const deletarDesenho = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM desenhos WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar' });
    if (this.changes === 0) return res.status(404).json({ erro: 'Desenho não encontrado' });
    res.json({ sucesso: true, mensagem: 'Desenho deletado' });
  });
};
```

#### 3. Adicionar rotas (`backend/routes.js`)

```javascript
import { criarDesenho, listarDesenhos, deletarDesenho } from './projectControllers.js';

// No arquivo de rotas, adicionar:
router.post('/desenhos', verificarToken, criarDesenho);
router.get('/projetos/:projeto_id/desenhos', verificarToken, listarDesenhos);
router.delete('/desenhos/:id', verificarToken, deletarDesenho);
```

---

## 🎨 Frontend: Como Adicionar Nova Seção

Exemplo: Adicionar seção de **Fotos de Obra**

#### 1. Adicionar no HTML (`web/index-novo.html`)

```html
<!-- No navbar, adicionar link: -->
<li><a href="#" data-section="fotos" class="nav-link">Fotos</a></li>

<!-- Na section principal, adicionar: -->
<section id="fotos-section" class="section">
  <div class="section-header">
    <h2>Fotos da Obra</h2>
    <input type="file" id="fotosUpload" accept="image/*" multiple class="file-input">
  </div>
  <div class="fotos-gallery" id="fotosGallery">
    <p class="loading">Carregando fotos...</p>
  </div>
</section>
```

#### 2. Adicionar CSS (`web/styles-novo.css`)

```css
.file-input {
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
}

.fotos-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.foto-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
}

.foto-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.foto-card:hover img {
  transform: scale(1.05);
}

.foto-info {
  padding: 10px;
  background: white;
  font-size: 0.9em;
  color: #7f8c8d;
}
```

#### 3. Adicionar JavaScript (`web/app-novo.js`)

```javascript
// No init()
switchSection('fotos') -> {
  loadFotos();
}

async function loadFotos() {
  try {
    let fotos = [];
    
    for (const projeto of projetos) {
      const response = await fetch(`${API_URL}/projetos/${projeto.id}/fotos`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (response.ok) {
        const fs = await response.json();
        fotos = [...fotos, ...fs.map(f => ({...f, projeto: projeto.nome}))];
      }
    }
    
    renderFotos(fotos);
  } catch (err) {
    showAlert('❌ Erro ao carregar fotos', 'error');
  }
}

function renderFotos(fotos) {
  const container = document.getElementById('fotosGallery');
  
  if (fotos.length === 0) {
    container.innerHTML = '<p class="loading">Nenhuma foto ainda</p>';
    return;
  }
  
  let html = '';
  fotos.forEach(f => {
    html += `
      <div class="foto-card">
        <img src="${f.url}" alt="Foto - ${f.data}">
        <div class="foto-info">
          <small>${f.data} - ${f.projeto}</small>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}
```

---

## 🚀 Próximas Features Propostas

### 1. **Sistema de Fotos com Antes/Depois**
**Dificuldade:** ⭐⭐ (Médio)
```
- Upload de fotos por fase
- Galeria com datas
- Antes/Depois slider
- Integração com Google Photos (opcional)
```

**Tempo estimado:** 3-4 horas

### 2. **Relatórios em PDF**
**Dificuldade:** ⭐⭐ (Médio)
```
- npm install pdfkit
- Gerar PDF com:
  - Dados do projeto
  - Progresso por fase
  - Orçamento vs. Gasto
  - Cronograma
```

**Tempo estimado:** 4-5 horas

### 3. **Notificações em Tempo Real**
**Dificuldade:** ⭐⭐⭐ (Avançado)
```
- npm install socket.io
- Notificações quando:
  - Atividade vence
  - Material chega
  - Fase é concluída
- Toast notifications na interface
```

**Tempo estimado:** 5-6 horas

### 4. **Google Calendar Integration**
**Dificuldade:** ⭐⭐⭐ (Avançado)
```
- npm install google-calendar
- Exportar cronograma para Google Calendar
- Sincronizar automaticamente
- Lembretes no Gmail
```

**Tempo estimado:** 6-8 horas

### 5. **Integração WhatsApp (Twilio)**
**Dificuldade:** ⭐⭐⭐ (Avançado)
```
- npm install twilio
- Enviar notificações via WhatsApp
- Receber atualizações via chat
- Mensagens de status do projeto
```

**Tempo estimado:** 6-8 horas

### 6. **Sistema de Permissões Avançado**
**Dificuldade:** ⭐⭐ (Médio)
```
- Adicionar tabela: user_project_permissions
- Cada usuário tem permissões por projeto
- Gerador vs. apenas visualizar
- Admin por projeto
```

**Tempo estimado:** 3-4 horas

### 7. **Backup & Restore do Banco**
**Dificuldade:** ⭐⭐ (Médio)
```
- Exportar SQLite para JSON
- Fazer backup automático
- Restaurar de backup
- Histórico de versões
```

**Tempo estimado:** 2-3 horas

### 8. **Dark Mode**
**Dificuldade:** ⭐ (Fácil)
```
- Adicionar toggle no navbar
- CSS variables para tema
- Salvar preferência no localStorage
```

**Tempo estimado:** 1-2 horas

---

## 🔄 Fluxo Genérico: Nova Feature

1. **Planejar**
   - Qual é o objetivo?
   - Que dados precisa?
   - Como o usuário vai usar?

2. **Backend**
   - Adicionar tabela em `database.js`
   - Criar controllers em `projectControllers.js`
   - Adicionar rotas em `routes.js`
   - Testar com Postman/Thunder Client

3. **Frontend**
   - Adicionar HTML (section + modal)
   - Adicionar CSS (styles)
   - Adicionar JavaScript (fetch + render)
   - Testar funcionamento completo

4. **Testes**
   - CRUD (Create, Read, Update, Delete)
   - Casos de erro
   - Comportamento em mobile
   - Performance

---

## 🔍 Debugging Tips

### Ver logs do backend
```bash
# Terminal já mostra tudo, procure por:
# - "✓" = sucesso
# - Erro vermelho = problema
```

### Testar API diretamente
```bash
# Terminal C - testar endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/projetos
```

### Inspecionar banco de dados
```bash
# Instalar SQLite CLI:
sudo apt install sqlite3

# Abrir banco:
cd backend
sqlite3 tasks.db

# Ver tabelas:
.tables

# Ver estrutura:
.schema projetos

# Fazer query:
SELECT * FROM projetos;
```

---

## 📚 Recursos Úteis

### Documentação Online
- [Express.js Docs](https://expressjs.com/)
- [SQLite Docs](https://www.sqlite.org/)
- [JWT.io](https://jwt.io/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Ferramentas
- **Postman** - Testar API (desktop)
- **Thunder Client** - VS Code extension
- **DB Browser for SQLite** - Visualizar banco graficamente
- **DevTools** - F12 no navegador

### Comunidades
- Stack Overflow
- GitHub Discussions
- Dev.to
- Reddit r/webdev

---

## 🎓 Aprender Mais

Se quer aprofundar em:

**Node.js/Express**
- Tutorial: https://nodejs.org/en/docs/guides/

**SQLite**
- Guia: https://www.sqlitetutorial.net/

**JWT**
- Artigo: https://auth0.com/intro-to-json-web-tokens

**REST API Design**
- Best Practices: https://restfulapi.net/

---

**Criado em:** 25 de Março de 2026  
**Para:** Desenvolvimento Continuado do Projeto
