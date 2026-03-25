// ===== CONFIGURAÇÃO DA API =====
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let projetos = [];
let projetosAtivos = [];

// ===== ELEMENTOS DO DOM =====
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Botões de modal
const newProjectBtn = document.getElementById('newProjectBtn');
const newMaterialBtn = document.getElementById('newMaterialBtn');
const projectModal = document.getElementById('projectModal');
const materialModal = document.getElementById('materialModal');
const projectForm = document.getElementById('projectForm');
const materialForm = document.getElementById('materialForm');
const cancelProjectBtn = document.getElementById('cancelProjectBtn');
const cancelMaterialBtn = document.getElementById('cancelMaterialBtn');

// ===== INICIALIZAÇÃO =====
function init() {
  if (authToken && currentUser) {
    showDashboard();
    loadDashboard();
    loadProjetos();
  } else {
    showLogin();
  }
  attachEventListeners();
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
  // Login
  loginForm?.addEventListener('submit', handleLogin);
  logoutBtn?.addEventListener('click', handleLogout);

  // Toggle Password Visibilidade
  const togglePasswordBtn = document.getElementById('togglePassword');
  if (togglePasswordBtn) {
    togglePasswordBtn?.addEventListener('click', () => {
      const passwordInput = document.getElementById('password');
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      // Muda a carinha do macaco! 🙈 = escondido, 🐵 = visível
      togglePasswordBtn.textContent = type === 'password' ? '🙈' : '🐵';
    });
  }

  // Modal Recuperação de Senha (SMS)
  const esqueciSenhaLink = document.getElementById('esqueciSenhaLink');
  const recoveryModal = document.getElementById('recoveryModal');
  const closeRecoveryModal = document.getElementById('closeRecoveryModal');
  const sendSmsBtn = document.getElementById('sendSmsBtn');
  const resetPasswordBtn = document.getElementById('resetPasswordBtn');
  const stepPhone = document.getElementById('stepPhone');
  const stepCode = document.getElementById('stepCode');

  if (esqueciSenhaLink) {
    esqueciSenhaLink?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(recoveryModal);
      stepPhone.style.display = 'block';
      stepCode.style.display = 'none';
      document.getElementById('recoveryPhone').value = '';
    });

    closeRecoveryModal?.addEventListener('click', () => {
      closeModal(recoveryModal);
    });

    // Simular o Envio do SMS
    sendSmsBtn?.addEventListener('click', () => {
      const emailInput = document.getElementById('recoveryEmail').value;
      const phoneInput = document.getElementById('recoveryPhone').value;
      
      if (!emailInput) {
        showAlert('Informe qual conta (E-mail ou CPF) você quer recuperar!', 'error');
        return;
      }
      
      if (phoneInput.length > 8) {
        // Simula comunicação com a operadora
        sendSmsBtn.textContent = 'Enviando...';
        sendSmsBtn.style.opacity = '0.7';
        
        setTimeout(() => {
          showAlert(`Código SMS enviado para ${phoneInput} (Conta: ${emailInput})`, 'success');
          stepPhone.style.display = 'none';
          stepCode.style.display = 'block';
          sendSmsBtn.textContent = 'Enviar Código via SMS';
          sendSmsBtn.style.opacity = '1';
        }, 1500); // 1.5s de delay simulando o backend
      } else {
        showAlert('Digite um número de celular válido!', 'error');
      }
    });

    // Finalizar troca de senha
    resetPasswordBtn?.addEventListener('click', () => {
      const code = document.getElementById('recoveryCode').value;
      const newPass = document.getElementById('newPassword').value;
      
      if (code && newPass) {
        resetPasswordBtn.textContent = 'Redefinindo...';
        setTimeout(() => {
          showAlert('Senha alterada com sucesso! Você já pode entrar.', 'success');
          closeModal(recoveryModal);
          resetPasswordBtn.textContent = 'Redefinir e Entrar';
        }, 1000);
      } else {
        showAlert('Preencha o código recebido e a nova senha.', 'error');
      }
    });
  }

  // Navegação
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.dataset.section;
      switchSection(section);
    });
  });

  // Modais de projeto
  newProjectBtn?.addEventListener('click', () => openModal(projectModal));
  cancelProjectBtn?.addEventListener('click', () => closeModal(projectModal));
  projectForm?.addEventListener('submit', handleCreateProject);

  // Modais de material
  newMaterialBtn?.addEventListener('click', () => {
    const select = document.getElementById('materialProjetoSelect');
    if(select) {
      select.innerHTML = '<option value="">Selecione o Projeto...</option>' + 
        projetos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    }
    openModal(materialModal);
  });
  cancelMaterialBtn?.addEventListener('click', () => closeModal(materialModal));
  materialForm?.addEventListener('submit', handleCreateMaterial);

  // Fechar modais ao clicar fora
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal').classList.remove('active');
    });
  });

  // Fechar modais ao clicar no overlay
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

// ===== LOGIN =====
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
      showAlert('❌ ' + (data.erro || 'Erro ao fazer login'), 'error');
      return;
    }

    authToken = data.token;
    currentUser = data.usuario;
    localStorage.setItem('token', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    loginForm?.reset();
    showDashboard();
    loadDashboard();
    loadProjetos();
  } catch (err) {
    showAlert('❌ Erro de conexão', 'error');
  }
}

function handleLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  loginForm?.reset();
  showLogin();
}

// ===== TELAS =====
function showLogin() {
  loginScreen.classList.add('active');
  dashboardScreen.classList.remove('active');
}

function showDashboard() {
  loginScreen.classList.remove('active');
  dashboardScreen.classList.add('active');
  userEmail.textContent = currentUser?.email || 'Usuário';
}

function switchSection(section) {
  // Atualizar navegação
  navLinks.forEach(link => link.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

  // Mostrar seção
  sections.forEach(s => s.classList.remove('active'));
  document.getElementById(`${section}-section`)?.classList.add('active');

  // Carregar dados específicos da seção
  if (section === 'projetos') {
    loadProjetos();
  } else if (section === 'atividades') {
    loadAtividades();
  } else if (section === 'materiais') {
    loadMateriais();
  }
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) return;

    const data = await response.json();
    document.getElementById('totalProjetos').textContent = data.totalProjetos || '0';
    document.getElementById('projetosEmAndamento').textContent = data.projetosEmAndamento || '0';
    document.getElementById('atividadesPendentes').textContent = data.atividadesPendentes || '0';
    document.getElementById('materiaisEntregues').textContent = data.materiaisEntregues || '0';

    // Carregar lista de projetos recentes
    loadProjetosRecentes();
    setTimeout(() => window.renderChartOnDashboard(), 500);
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
}

async function loadProjetosRecentes() {
  try {
    const response = await fetch(`${API_URL}/projetos`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) return;

    const projetos = await response.json();
    const container = document.querySelector('.projects-table');

    if (projetos.length === 0) {
      container.innerHTML = '<p class="loading">Nenhum projeto ainda</p>';
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>Projeto</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Andamento</th>
          </tr>
        </thead>
        <tbody>
    `;

    projetos.slice(0, 5).forEach(p => {
      html += `
        <tr>
          <td><strong>${p.nome}</strong></td>
          <td>${p.localizacao}</td>
          <td><span class="status-badge status-${p.status}">${p.status}</span></td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${p.porcentagem_concluida || 0}%"></div>
            </div>
            ${p.porcentagem_concluida || 0}%
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (err) {
    console.error('Erro ao carregar projetos recentes:', err);
  }
}

// ===== PROJETOS =====
async function loadProjetos() {
  try {
    const response = await fetch(`${API_URL}/projetos`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) return;

    projetos = await response.json();
    renderProjetos();
  } catch (err) {
    showAlert('❌ Erro ao carregar projetos', 'error');
  }
}

function renderProjetos() {
  const container = document.getElementById('projectsContainer');

  if (projetos.length === 0) {
    container.innerHTML = '<p class="loading">Nenhum projeto encontrado. Crie um novo!</p>';
    return;
  }

  let html = '';
  projetos.forEach(p => {
    html += `
      <div class="project-card" onclick="viewProject(${p.id})">
        <h3>${p.nome}</h3>
        <p><strong>📍 ${p.localizacao}</strong></p>
        <p>Tipo: ${p.tipo}</p>
        <p>Status: <strong>${p.status}</strong></p>
        
        <div class="project-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${p.porcentagem_concluida || 0}%"></div>
          </div>
          <small>📊 ${p.porcentagem_concluida || 0}% Executado da Obra</small>
        </div>

        <div class="project-footer">
          <span>Orçamento: R$ ${(p.orcamento_total || 0).toFixed(2)}</span>
          <span>Gasto: R$ ${(p.orcamento_gasto || 0).toFixed(2)}</span>
        </div>

        <div class="project-actions">
          <button class="btn btn-secondary" onclick="event.stopPropagation(); window.abrirModalFotos(this.dataset.id)" data-id="${p.id}">📷 Fotos/Docs</button>
          <button class="btn btn-primary" onclick="event.stopPropagation(); window.abrirModalEdicao(this.dataset.id)" data-id="${p.id}">✏️ Editar</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function handleCreateProject(e) {
  e.preventDefault();
  const formData = new FormData(projectForm);
  const projeto = Object.fromEntries(formData);

  try {
    const response = await fetch(`${API_URL}/projetos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(projeto)
    });

    if (!response.ok) {
      const error = await response.json();
      showAlert('❌ ' + (error.erro || 'Erro ao criar projeto'), 'error');
      return;
    }

    showAlert('✅ Projeto criado com sucesso!', 'success');
    projectForm.reset();
    closeModal(projectModal);
    loadProjetos();
    loadDashboard();
  } catch (err) {
    showAlert('❌ Erro ao criar projeto', 'error');
  }
}

function viewProject(id) {
  // Implementar visualização detalhada do projeto
  const projeto = projetos.find(p => p.id === id);
  if (projeto) {
    alert(`Projeto: ${projeto.nome}\nLocalização: ${projeto.localizacao}\nStatus: ${projeto.status}`);
  }
}

// ===== ATIVIDADES =====
async function loadAtividades() {
  try {
    // Carregar atividades de todos os projetos
    let atividades = [];
    
    for (const projeto of projetos) {
      // Obter fases do projeto
      const fasesResponse = await fetch(`${API_URL}/projetos/${projeto.id}/fases`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (fasesResponse.ok) {
        const fases = await fasesResponse.json();
        
        // Obter atividades de cada fase
        for (const fase of fases) {
          const atividadesResponse = await fetch(`${API_URL}/fases/${fase.id}/atividades`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });

          if (atividadesResponse.ok) {
            const ativs = await atividadesResponse.json();
            atividades = [...atividades, ...ativs.map(a => ({...a, projeto: projeto.nome}))];
          }
        }
      }
    }

    renderAtividades(atividades);
  } catch (err) {
    showAlert('❌ Erro ao carregar atividades', 'error');
  }
}

function renderAtividades(atividades) {
  const container = document.getElementById('activitiesList');

  if (atividades.length === 0) {
    container.innerHTML = '<p class="loading">Nenhuma atividade encontrada</p>';
    return;
  }

  let html = '';
  atividades.forEach(a => {
    html += `
      <div class="activity-item ${a.status}">
        <div class="activity-content">
          <h4>${a.titulo}</h4>
          <p>${a.descricao || 'Sem descrição'}</p>
          <small>Projeto: ${a.projeto} | Vencimento: ${a.data_vencimento || 'N/A'}</small>
        </div>
        <div class="activity-actions">
          <span class="status-badge status-${a.status}">${a.status}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ===== MATERIAIS =====
async function loadMateriais() {
  try {
    let materiais = [];

    for (const projeto of projetos) {
      const response = await fetch(`${API_URL}/projetos/${projeto.id}/materiais`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (response.ok) {
        const mats = await response.json();
        materiais = [...materiais, ...mats.map(m => ({...m, projeto: projeto.nome}))];
      }
    }

    renderMateriais(materiais);
  } catch (err) {
    showAlert('❌ Erro ao carregar materiais', 'error');
  }
}

function renderMateriais(materiais) {
  const container = document.getElementById('materialsList');

  if (materiais.length === 0) {
    container.innerHTML = '<p class="loading">Nenhum material cadastrado</p>';
    return;
  }

  let html = '';
  materiais.forEach(m => {
    html += `
      <div class="material-card">
        <div class="material-info">
          <h4>${m.nome}</h4>
          <p>${m.descricao || ''}</p>
          <small>Projeto: ${m.projeto} | Fornecedor: ${m.fornecedor || 'N/A'}</small>
        </div>
        <div class="material-qty">
          ${m.quantidade} ${m.unidade || 'un'}
        </div>
        <div class="material-value">
          R$ ${(m.valor_total || 0).toFixed(2)}
        </div>
        <span class="status-badge status-${m.status}">${m.status}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function handleCreateMaterial(e) {
  e.preventDefault();
  const formData = new FormData(materialForm);
  const material = Object.fromEntries(formData);

  try {
    const response = await fetch(`${API_URL}/materiais`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(material)
    });

    if (!response.ok) {
      const error = await response.json();
      showAlert('❌ ' + (error.erro || 'Erro ao criar material'), 'error');
      return;
    }

    showAlert('✅ Material adicionado com sucesso!', 'success');
    materialForm.reset();
    closeModal(materialModal);
    loadMateriais();
  } catch (err) {
    showAlert('❌ Erro ao criar material', 'error');
  }
}

// ===== MODAIS =====
function openModal(modal) {
  modal.classList.add('active');
}

function closeModal(modal) {
  modal.classList.remove('active');
}

// ===== NOTIFICAÇÕES =====
function showAlert(message, type = 'info') {
  // Implementar notificação mais sofisticada se desejar
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Por enquanto, usar alert simples
  if (type === 'error') {
    alert(message);
  }
}

// ===== INICIAR APLICAÇÃO =====
document.addEventListener('DOMContentLoaded', init);

// Tornar funções globais para permitir os cliques nos botões HTML gerados em string e modais:
window.closeModal = function(modal) {
  modal.classList.remove('active');
};

let projetoEditandoId = null;

window.abrirModalFotos = function(projId) {
  projetoEditandoId = projId;
  const modal = document.getElementById('fotosModal');
  modal.classList.add('active');
};

window.abrirModalEdicao = function(projId) {
  projetoEditandoId = projId;
  const projeto = projetos.find(p => p.id == projId);
  const modal = document.getElementById('editProjetoModal');
  
  // Preencher dados atuais
  if(projeto) {
    document.getElementById('editProgresso').value = projeto.porcentagem_concluida || 0;
    document.getElementById('editOrcamento').value = projeto.orcamento_gasto || '';
    document.getElementById('editMeta').value = projeto.descricao || '';
    const statusEl = document.getElementById('editStatus');
    if(statusEl && projeto.status) {
        statusEl.value = projeto.status;
    }
  }

  modal.classList.add('active');
};

window.salvarFotoDoc = function() {
  showAlert('✅ Foto/Documento salvo com sucesso no projeto (Simulação interna concluída)', 'success');
  window.closeModal(document.getElementById('fotosModal'));
};

window.salvarEdicaoProjeto = async function() {
  const meta = document.getElementById('editMeta').value;
  const progresso = document.getElementById('editProgresso').value;
  const statusEl = document.getElementById('editStatus');
  const statusDesc = statusEl ? statusEl.value : null;
  const orcamentoEl = document.getElementById('editOrcamento');
  let orcamento = orcamentoEl ? orcamentoEl.value : null;

  if(projetoEditandoId) {
    const projeto = projetos.find(p => p.id == projetoEditandoId);
    if(projeto) {
      const payload = {
        nome: projeto.nome, // Enviando os dados existentes se nao editou
        descricao: meta ? meta : projeto.descricao, 
        status: statusDesc ? statusDesc : projeto.status,
        porcentagem_concluida: progresso ? parseInt(progresso) : projeto.porcentagem_concluida,
        orcamento_gasto: orcamento ? parseFloat(orcamento) : projeto.orcamento_gasto,
        data_termino_real: projeto.data_termino_real
      };

      try {
        const response = await fetch(`${API_URL}/projetos/${projetoEditandoId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          // Atualiza na view local
          projeto.porcentagem_concluida = payload.porcentagem_concluida;
          projeto.status = payload.status;
          projeto.descricao = payload.descricao;
          projeto.orcamento_gasto = payload.orcamento_gasto;
          
          renderProjetos();
          loadDashboard(); // Recarrega gráficos se alterar algo
          showAlert(`✅ Informações e progresso atualizados com sucesso no banco!`, 'success');
        } else {
          showAlert(`❌ Erro ao atualizar os dados do banco!`, 'error');
        }
      } catch (err) {
        showAlert(`❌ Erro na conexão para atualizar o projeto.`, 'error');
      }
    }
  }

  window.closeModal(document.getElementById('editProjetoModal'));
  document.getElementById('editMeta').value = '';
  document.getElementById('editProgresso').value = '';
  if (orcamentoEl) orcamentoEl.value = '';
};

// ==========================================
// ✨ LÓGICA DAS FUNÇÕES PREMIUM DA TELA
// ==========================================

// 1. TEMA ESCURO (DARK MODE)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  // Checa se o usuário já havia escolhido e salvo o tema no computador dele
  const themeSalvo = localStorage.getItem('theme');
  if (themeSalvo === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    // Troca o tema
    if (isDark) {
      document.body.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
    
    // Recarrega o gráfico para ele trocar as cores do texto
    if(window.renderChartOnDashboard) window.renderChartOnDashboard();
  });
}

// 2. GERAR RELATÓRIO PDF (HTML2PDF)
window.gerarRelatorioPDF = function() {
  const element = document.getElementById('dashboard-section');
  const opt = {
    margin:       1,
    filename:     'Relatorio_de_Obras.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  // Mostra um alerta pra o usuário saber que tá carregando
  showAlert('⏳ Gerando Relatório PDF em alta qualidade, aguarde...', 'info');
  html2pdf().set(opt).from(element).save().then(() => {
    showAlert('✅ Relatório PDF baixado com sucesso!', 'success');
  });
};

// 3. GRÁFICOS (CHART.JS)
let dashboardChartInstance = null;

window.renderChartOnDashboard = function(dataStats) {
  const ctx = document.getElementById('dashboardChart');
  if (!ctx) return;
  
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#ffffff' : '#333333';
  const gridColor = isDark ? '#333333' : '#e0e0e0';

  if (dashboardChartInstance) {
    dashboardChartInstance.destroy();
  }

  // Se não tivermos dados da API, usamos os dados visuais lidos ou um padrão visual para demonstração
  const andamento = parseInt(document.getElementById('projetosEmAndamento').textContent) || 3;
  const pendentes = parseInt(document.getElementById('atividadesPendentes').textContent) || 5;
  const total = parseInt(document.getElementById('totalProjetos').textContent) || 8;
  const entregues = parseInt(document.getElementById('materiaisEntregues').textContent) || 4;

  dashboardChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Em Andamento', 'Pendências', 'Finalizados', 'Fase de Planejamento'],
      datasets: [{
        label: 'Métricas das Obras',
        data: [andamento, pendentes, entregues, (total - andamento)], 
        backgroundColor: [
          '#3498db', // Azul
          '#e74c3c', // Vermelho
          '#2ecc71', // Verde
          '#f1c40f'  // Amarelo
        ],
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { size: 14 } } },
        tooltip: { boxPadding: 6 }
      },
      scales: {
        y: { 
          beginAtZero: true, 
          ticks: { color: textColor }, 
          grid: { color: gridColor } 
        },
        x: { 
          ticks: { color: textColor }, 
          grid: { display: false } 
        }
      }
    }
  });
};
