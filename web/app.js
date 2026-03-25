// Configuração da API
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let currentFilter = 'all';
let allTasks = [];

// Elementos da DOM
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
const newTaskBtn = document.getElementById('newTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const cancelBtn = document.getElementById('cancelBtn');
const modalClose = document.querySelector('.modal-close');
const tasksList = document.getElementById('tasksList');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

// Inicialização
function init() {
  if (authToken && currentUser) {
    showDashboard();
    loadTasks();
    loadStats();
  } else {
    showLogin();
  }
  attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  newTaskBtn.addEventListener('click', openTaskModal);
  taskForm.addEventListener('submit', handleSaveTask);
  cancelBtn.addEventListener('click', closeTaskModal);
  modalClose.addEventListener('click', closeTaskModal);
  filterBtns.forEach(btn => btn.addEventListener('click', handleFilter));
  searchInput.addEventListener('input', handleSearch);

  taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) closeTaskModal();
  });
}

// LOGIN
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert('❌ ' + data.erro);
      return;
    }

    authToken = data.token;
    currentUser = data.usuario;
    localStorage.setItem('token', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

    showDashboard();
    loadTasks();
    loadStats();
  } catch (err) {
    alert('Erro ao conectar: ' + err.message);
  }
}

// LOGOUT
function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    allTasks = [];
    showLogin();
  }
}

// SHOW/HIDE SCREENS
function showLogin() {
  loginScreen.classList.add('active');
  dashboardScreen.classList.remove('active');
}

function showDashboard() {
  loginScreen.classList.remove('active');
  dashboardScreen.classList.add('active');
  userEmail.textContent = currentUser.email;
}

// CARREGAR TAREFAS
async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tarefas`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    allTasks = data;
    renderTasks();
  } catch (err) {
    console.error('Erro ao carregar tarefas:', err);
  }
}

// RENDERIZAR TAREFAS
function renderTasks() {
  let filtered = allTasks;

  // FILTRO
  if (currentFilter !== 'all') {
    if (currentFilter === 'concluida') {
      filtered = filtered.filter(t => t.concluida === 1);
    } else {
      filtered = filtered.filter(t => t.status === currentFilter);
    }
  }

  // PESQUISA
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(t =>
      t.titulo.toLowerCase().includes(searchTerm) ||
      t.descricao.toLowerCase().includes(searchTerm)
    );
  }

  // RENDERIZAR
  if (filtered.length === 0) {
    tasksList.innerHTML = '<p class="loading">Nenhuma tarefa encontrada</p>';
    return;
  }

  tasksList.innerHTML = filtered.map(task => `
    <div class="task-card ${task.concluida ? 'concluida' : ''} ${task.prioridade}">
      <div class="task-header">
        <div class="task-title ${task.concluida ? 'done' : ''}">${escapeHtml(task.titulo)}</div>
      </div>
      <div class="task-badges">
        <span class="badge badge-category">${task.categoria}</span>
        <span class="badge badge-priority ${task.prioridade}">${task.prioridade}</span>
        <span class="badge" style="background:#e7e7e7;color:#333">${task.status}</span>
      </div>
      ${task.descricao ? `<p class="task-desc">${escapeHtml(task.descricao)}</p>` : ''}
      ${task.data_vencimento ? `<p class="task-date">📅 ${formatDate(task.data_vencimento)}</p>` : ''}
      <div class="task-actions">
        ${task.concluida === 0 ? 
          `<button class="btn-sm btn-checkbox" onclick="toggleTask(${task.id})">✓ Concluir</button>` : 
          `<button class="btn-sm btn-checkbox" onclick="uncompleteTask(${task.id})">↩ Desfazer</button>`
        }
        <button class="btn-sm btn-edit" onclick="editTask(${task.id})">✎ Editar</button>
        <button class="btn-sm btn-delete" onclick="deleteTask(${task.id})">🗑 Deletar</button>
      </div>
    </div>
  `).join('');

  updateFiltersCount();
}

// FILTROS
function handleFilter(e) {
  filterBtns.forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  currentFilter = e.target.dataset.filter;
  renderTasks();
}

function updateFiltersCount() {
  const counts = {
    all: allTasks.length,
    pendente: allTasks.filter(t => t.status === 'pendente').length,
    em_progresso: allTasks.filter(t => t.status === 'em_progresso').length,
    concluida: allTasks.filter(t => t.concluida === 1).length
  };

  filterBtns.forEach(btn => {
    const filter = btn.dataset.filter;
    btn.textContent = btn.textContent.split('(')[0] + `(${counts[filter]})`;
  });
}

// PESQUISA
function handleSearch() {
  renderTasks();
}

// MODAL
function openTaskModal() {
  document.getElementById('modalTitle').textContent = 'Nova Tarefa';
  taskForm.dataset.taskId = '';
  taskForm.reset();
  document.getElementById('taskPriority').value = 'media';
  taskModal.classList.add('active');
}

function closeTaskModal() {
  taskModal.classList.remove('active');
  taskForm.reset();
}

// EDITAR TAREFA
function editTask(id) {
  const task = allTasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById('modalTitle').textContent = 'Editar Tarefa';
  document.getElementById('taskTitle').value = task.titulo;
  document.getElementById('taskDesc').value = task.descricao;
  document.getElementById('taskCategory').value = task.categoria;
  document.getElementById('taskPriority').value = task.prioridade;
  document.getElementById('taskDate').value = task.data_vencimento || '';
  taskForm.dataset.taskId = id;
  taskModal.classList.add('active');
}

// SALVAR TAREFA
async function handleSaveTask(e) {
  e.preventDefault();
  const taskId = taskForm.dataset.taskId;
  const titulo = document.getElementById('taskTitle').value;
  const descricao = document.getElementById('taskDesc').value;
  const categoria = document.getElementById('taskCategory').value;
  const prioridade = document.getElementById('taskPriority').value;
  const data_vencimento = document.getElementById('taskDate').value;

  const payload = {
    titulo,
    descricao,
    categoria,
    prioridade,
    data_vencimento: data_vencimento || null
  };

  try {
    if (taskId) {
      // EDITAR
      payload.status = allTasks.find(t => t.id == taskId).status;
      payload.concluida = allTasks.find(t => t.id == taskId).concluida;
      
      const response = await fetch(`${API_URL}/tarefas/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        alert('Erro ao atualizar tarefa');
        return;
      }
      alert('✓ Tarefa atualizada!');
    } else {
      // CRIAR
      const response = await fetch(`${API_URL}/tarefas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        alert('Erro ao criar tarefa');
        return;
      }
      alert('✓ Tarefa criada!');
    }

    closeTaskModal();
    loadTasks();
    loadStats();
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

// DELETAR TAREFA
async function deleteTask(id) {
  if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) {
      alert('Erro ao deletar tarefa');
      return;
    }

    alert('✓ Tarefa deletada!');
    loadTasks();
    loadStats();
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

// MARCAR COMO CONCLUÍDA
async function toggleTask(id) {
  const task = allTasks.find(t => t.id === id);
  if (!task) return;

  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        ...task,
        concluida: 1,
        status: 'concluida'
      })
    });

    if (!response.ok) {
      alert('Erro ao atualizar tarefa');
      return;
    }

    loadTasks();
    loadStats();
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

// DESFAZER CONCLUSÃO
async function uncompleteTask(id) {
  const task = allTasks.find(t => t.id === id);
  if (!task) return;

  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        ...task,
        concluida: 0,
        status: 'pendente'
      })
    });

    if (!response.ok) {
      alert('Erro ao atualizar tarefa');
      return;
    }

    loadTasks();
    loadStats();
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

// ESTATÍSTICAS
async function loadStats() {
  try {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const stats = await response.json();
    const statsDiv = document.getElementById('stats');

    statsDiv.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Total</span>
        <span class="stat-value">${stats.total || 0}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Pendentes</span>
        <span class="stat-value">${stats.pendentes || 0}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Em Progresso</span>
        <span class="stat-value">${stats.em_progresso || 0}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Concluídas</span>
        <span class="stat-value">${stats.concluidas || 0}</span>
      </div>
    `;
  } catch (err) {
    console.error('Erro ao carregar estatísticas:', err);
  }
}

// UTILITÁRIOS
function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Iniciar
init();
