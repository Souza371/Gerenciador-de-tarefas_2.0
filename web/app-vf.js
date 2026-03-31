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
  // Evento do Mural de Avisos
  const editNoticeBtn = document.getElementById('editNoticeBtn');
  if (editNoticeBtn) {
    editNoticeBtn.addEventListener('click', () => {
      const p = document.getElementById('boardNotices');
      const text = prompt("Digite o novo aviso para a equipe:", p.innerText);
      if(text !== null && text.trim() !== "") {
        p.innerText = text;
        localStorage.setItem('projeto_avisos', text); // Salva os avisos localmente para o time
      }
    });
    
    // Tenta carregar aviso salvo
    const savedNotice = localStorage.getItem('projeto_avisos');
    if(savedNotice) {
      document.getElementById('boardNotices').innerText = savedNotice;
    }
  }

  // Login
  loginForm?.addEventListener('submit', handleLogin);
  logoutBtn?.addEventListener('click', handleLogout);

  // Sistema de Busca em Tempo Real (Offline/Leve)
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      const termo = e.target.value.toLowerCase();
      const projetosFiltrados = projetos.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        (p.localizacao && p.localizacao.toLowerCase().includes(termo))
      );
      renderProjetos(projetosFiltrados);
    });
  }

  // Toggle Password Visibilidade
  const togglePasswordBtn = document.getElementById('togglePassword');
  if (togglePasswordBtn) {
    togglePasswordBtn?.addEventListener('click', () => {
      const passwordInput = document.getElementById('password');
      const monkeyIcon = document.getElementById('monkeyIcon');
      const passwordStatusText = document.getElementById('passwordStatusText');
      const isPassword = passwordInput.getAttribute('type') === 'password';
      
      const newType = isPassword ? 'text' : 'password';
      passwordInput.setAttribute('type', newType);
      
      // Muda a carinha do macaco e o texto indicativo
      if (monkeyIcon) monkeyIcon.textContent = isPassword ? '🐵' : '🙈';
      if (passwordStatusText) passwordStatusText.textContent = isPassword ? 'Visível' : 'Oculto';
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
    console.log('📤 Tentando conectar em:', API_URL + '/auth/login');
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password })
    });

    console.log('📬 Resposta HTTP:', response.status);
    
    const data = await response.json();

    if (!response.ok) {
      showAlert('❌ ' + (data.erro || 'Erro ao fazer login'), 'error');
      console.error('Erro de login:', data);
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
    console.error('❌ Erro de conexão:', err.message);
    console.error('Tipo de erro:', err.constructor.name);
    showAlert('❌ Erro de conexão: ' + err.message + '\n\n⚠️ Verifique se o backend está rodando em http://localhost:5000\n💡 Abra F12 > Console para mais detalhes', 'error');
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

// ===== SISTEMA DE CHAT AVANÇADO =====
let usuariosEquipe = [
  { id: 1, nome: 'João Carlos', avatar: 'JC', role: 'Engenheiro', online: true },
  { id: 2, nome: 'Carlos Matos', avatar: 'CM', role: 'Técnico', online: true },
  { id: 3, nome: 'Larissa Andrade', avatar: 'LA', role: 'Coordenadora', online: false },
  { id: 4, nome: 'Marina Barbosa', avatar: 'MB', role: 'Designer', online: true },
  { id: 5, nome: 'Ricardo Costa', avatar: 'RC', role: 'Desenvolvedor', online: true }
];

let conversas = [];
let conversaAtual = null;
let mensagensConversa = [];
let chatGeral = { id: 'geral', nome: 'Chat Geral', tipo: 'geral', mensagens: [] };
let mensagensNaoLidas = {}; // Track unread messages

// Inicializar sistema de chat
function inicializarChat() {
  // Inicializar chat geral com algumas mensagens
  if (chatGeral.mensagens.length === 0) {
    chatGeral.mensagens = [
      { tipo: 'other', avatar: 'JC', nome: 'João Carlos', texto: 'Bom dia pessoal! 👋', hora: '08:00', idUser: 1 },
      { tipo: 'other', avatar: 'CM', nome: 'Carlos Matos', texto: 'L@ pessoal, tudo bem?', hora: '08:15', idUser: 2 },
      { tipo: 'own', avatar: currentUser.avatar || 'VS', nome: 'Você', texto: 'Ótimo! Novo sistema de chat online! 🎉', hora: '08:30', idUser: currentUser.id }
    ];
  }

  // Criar conversas privadas automáticas com membros
  conversas = usuariosEquipe.map(user => ({
    id: 'privado_' + user.id,
    tipo: 'privado',
    userId: user.id,
    nome: user.nome,
    avatar: user.avatar,
    role: user.role,
    online: user.online,
    ultimaMensagem: 'Clique para conversar...',
    hora: '--',
    mensagens: []
  }));

  // Selecionar chat geral por padrão
  selecionarConversa('geral');
  renderizarConversas();
  renderizarUsuariosOnline();
}

// Renderizar lista de conversas privadas
function renderizarConversas() {
  const container = document.getElementById('chatConversations');
  if (!container) return;

  container.innerHTML = conversas.map(conversa => {
    const notaoLida = mensagensNaoLidas[conversa.id] || 0;
    return `
      <div onclick="selecionarConversa('${conversa.id}')" style="padding: 12px; background: white; border-radius: 6px; cursor: pointer; margin-bottom: 8px; border: 2px solid transparent; transition: all 0.3s; ${conversaAtual?.id === conversa.id ? 'border-color: #667eea; background: #f0f3ff;' : 'hover: border-color: #ddd;'}">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; position: relative;">
            ${conversa.avatar}
            <div style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; background: ${conversa.online ? '#28a745' : '#999'}; border: 2px solid white;"></div>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px;">${conversa.nome}</div>
            <small style="color: #999; font-size: 10px;">${conversa.role}</small>
          </div>
          ${notaoLida > 0 ? `<span style="background: #dc3545; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${notaoLida}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Renderizar usuários (todos: online + offline)
function renderizarUsuariosOnline() {
  const container = document.getElementById('usuariosOnlineList');
  if (!container) return;

  const usuariosOnline = usuariosEquipe.filter(u => u.online);
  const usuariosOffline = usuariosEquipe.filter(u => !u.online);

  let html = '';

  // Seção online
  if (usuariosOnline.length > 0) {
    html += usuariosOnline.map(user => `
      <div onclick="selecionarConversa('privado_${user.id}')" style="padding: 10px; background: #f8f9fa; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.3s; hover: background: #f0f0f0;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; position: relative; flex-shrink: 0;">
          ${user.avatar}
          <div style="position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; border-radius: 50%; background: #28a745; border: 2px solid white;"></div>
        </div>
        <div style="min-width: 0;">
          <div style="font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${user.nome}</div>
          <small style="color: #28a745; font-size: 10px;">🟢 Online</small>
        </div>
      </div>
    `).join('');
  }

  // Seção offline
  if (usuariosOffline.length > 0) {
    html += `
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
        <small style="font-size: 10px; text-transform: uppercase; color: #999; display: block; margin-bottom: 8px;">⚫ Offline</small>
    `;
    
    html += usuariosOffline.map(user => `
      <div onclick="selecionarConversa('privado_${user.id}')" style="padding: 10px; background: #f8f9fa; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.3s; margin-bottom: 8px; hover: background: #f0f0f0;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #ccc; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; position: relative; flex-shrink: 0;">
          ${user.avatar}
          <div style="position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; border-radius: 50%; background: #999; border: 2px solid white;"></div>
        </div>
        <div style="min-width: 0;">
          <div style="font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #666;">${user.nome}</div>
          <small style="color: #999; font-size: 10px;">Offline</small>
        </div>
      </div>
    `).join('');
    
    html += `</div>`;
  }

  container.innerHTML = html || '<p style="color: #999; font-size: 12px;">Nenhum usuário disponível</p>';
}

// Selecionar conversa
function selecionarConversa(conversaId) {
  if (conversaId === 'geral') {
    conversaAtual = chatGeral;
    mensagensConversa = chatGeral.mensagens;
    
    document.getElementById('chatHeaderTitle').textContent = '👥 Chat Geral';
    document.getElementById('chatHeaderInfo').textContent = 'Todos os membros da equipe podem ver as mensagens';
    
    const membros = [
      { nome: 'Você', avatar: 'VS', role: 'Administrador', online: true },
      ...usuariosEquipe
    ];
    renderizarMembros(membros);
  } else {
    const conversa = conversas.find(c => c.id === conversaId);
    if (!conversa) return;

    conversaAtual = conversa;
    mensagensConversa = conversa.mensagens;
    
    document.getElementById('chatHeaderTitle').textContent = conversa.nome;
    document.getElementById('chatHeaderInfo').innerHTML = `
      <span style="display: inline-block; width: 8px; height: 8px; background: ${conversa.online ? '#28a745' : '#999'}; border-radius: 50%; margin-right: 5px;"></span>
      ${conversa.online ? '🟢 Online agora' : '⚫ Offline'}
    `;
    
    renderizarMembros([
      { nome: 'Você', avatar: 'VS', role: 'Administrador', online: true },
      { nome: conversa.nome, avatar: conversa.avatar, role: conversa.role, online: conversa.online }
    ]);

    // Limpar mensagens não lidas
    mensagensNaoLidas[conversaId] = 0;
  }

  renderizarMensagens();
  document.getElementById('chatInput').disabled = false;
  document.getElementById('chatSendBtn').disabled = false;
  document.getElementById('chatInput').focus();
  
  renderizarConversas();
}

// Renderizar membros da conversa
function renderizarMembros(membros) {
  const container = document.getElementById('chatMembros');
  if (!container) return;

  container.innerHTML = membros.map(membro => `
    <div style="padding: 12px; background: #f8f9fa; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
      <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; position: relative; flex-shrink: 0;">
        ${membro.avatar}
        <div style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; background: ${membro.online ? '#28a745' : '#999'}; border: 2px solid white;"></div>
      </div>
      <div style="min-width: 0;">
        <div style="font-size: 13px; font-weight: 600;">${membro.nome}</div>
        <small style="color: #999; font-size: 11px;">${membro.role}</small>
      </div>
    </div>
  `).join('');
}

// Renderizar mensagens
function renderizarMensagens() {
  const container = document.getElementById('chatMessages');
  container.innerHTML = mensagensConversa.map((msg, idx) => `
    <div style="display: flex; ${msg.tipo === 'own' ? 'justify-content: flex-end;' : ''} animation: slideIn 0.3s ease;">
      ${msg.tipo === 'other' ? `
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; flex-shrink: 0; margin-right: 8px;">${msg.avatar}</div>
      ` : ''}
      <div style="max-width: 65%;">
        ${msg.tipo === 'other' ? `<small style="color: #999; font-size: 10px; margin-bottom: 2px; display: block;">${msg.nome}</small>` : ''}
        <div style="background: ${msg.tipo === 'own' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f0'}; color: ${msg.tipo === 'own' ? 'white' : '#333'}; padding: 10px 14px; border-radius: 12px; word-wrap: break-word;">
          <div style="font-size: 13px; line-height: 1.4;">${msg.texto}</div>
          <small style="font-size: 10px; opacity: 0.7; display: block; margin-top: 4px;">${msg.hora}</small>
        </div>
      </div>
    </div>
  `).join('');
  
  container.scrollTop = container.scrollHeight;
}

// Enviar mensagem
function enviarMensagem() {
  const input = document.getElementById('chatInput');
  const texto = input.value.trim();
  
  if (!texto || !conversaAtual) return;

  // Adicionar mensagem
  const novaMensagem = {
    tipo: 'own',
    avatar: 'VS',
    nome: currentUser.nome,
    texto: texto,
    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    idUser: currentUser.id
  };

  // Adicionar ao chat
  if (conversaAtual.tipo === 'geral') {
    chatGeral.mensagens.push(novaMensagem);
    chatGeral.mensagens[chatGeral.mensagens.length - 1].tipo = 'own';
  } else {
    conversaAtual.mensagens.push(novaMensagem);
    conversaAtual.ultimaMensagem = texto.substring(0, 30) + (texto.length > 30 ? '...' : '');
    conversaAtual.hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  renderizarMensagens();
  input.value = '';
  
  // Simular resposta automática após 2 segundos
  setTimeout(() => {
    const respostas = [
      '👍 Entendi!',
      'Certo, vou verificar isso!',
      'Excelente! Obrigado pela atualização.',
      'Combinado! Vou fazer agora.',
      '✅ Recebido! Vou processar isso.'
    ];
    
    const membro = conversaAtual.tipo === 'geral' 
      ? usuariosEquipe[Math.floor(Math.random() * usuariosEquipe.length)]
      : null;

    if (membro) {
      const respostaMsg = {
        tipo: 'other',
        avatar: membro.avatar,
        nome: membro.nome,
        texto: respostas[Math.floor(Math.random() * respostas.length)],
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        idUser: membro.id
      };

      if (conversaAtual.tipo === 'geral') {
        chatGeral.mensagens.push(respostaMsg);
      } else {
        conversaAtual.mensagens.push(respostaMsg);
      }

      renderizarMensagens();
    }
  }, 2000);
}

// ===== EVENT LISTENERS PARA CHAT =====
window.addEventListener('load', () => {
  inicializarChat();
  
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const dropZone = document.getElementById('dropZone');
  const fileUpload = document.getElementById('fileUpload');
  
  if (chatInput && chatSendBtn) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') enviarMensagem();
    });
    chatSendBtn.addEventListener('click', enviarMensagem);
  }
  
  // Drag and Drop para upload de fotos
  if (dropZone && fileUpload) {
    dropZone.addEventListener('click', () => fileUpload.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.background = '#f0f3ff';
      dropZone.style.borderColor = '#667eea';
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.background = 'white';
      dropZone.style.borderColor = '#667eea';
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.background = 'white';
      fileUpload.files = e.dataTransfer.files;
      simularUploadArquivos();
    });
    
    fileUpload.addEventListener('change', simularUploadArquivos);
  }
});

// ===== TELAS =====
function showLogin() {
  loginScreen.classList.add('active');
  dashboardScreen.classList.remove('active');
}

function showDashboard() {
  loginScreen.classList.remove('active');
  dashboardScreen.classList.add('active');
  userEmail.textContent = currentUser?.nome || 'Usuário';
  
  // Mostrar status online
  const userStatus = document.getElementById('userStatus');
  if (userStatus) {
    userStatus.textContent = '🟢 Online';
  }
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
  } else if (section === 'chat') {
    inicializarChat();
  }
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.status === 401 || response.status === 403) {
      handleLogout();
      return;
    }

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

    const data = await response.json();
    projetos = data; // Atualiza a variável global para que o Kanban de Atividades ache os projetos!
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
            <th>Ações</th>
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
          <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px; margin: 0; display: inline-block;" onclick="gerarRelatorioProjeto(${p.id})" title="Baixar PDF apenas deste projeto">📄 Relatório</button></td>
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

    if (response.status === 401 || response.status === 403) {
      handleLogout();
      return;
    }

    if (!response.ok) return;

    projetos = await response.json();
    renderProjetos();
  } catch (err) {
    showAlert('❌ Erro ao carregar projetos', 'error');
  }
}

function renderProjetos(listaParaRenderizar = projetos) {
  const container = document.getElementById('projectsContainer');

  if (listaParaRenderizar.length === 0) {
    container.innerHTML = '<p class="loading">Nenhum projeto encontrado.</p>';
    return;
  }

  let html = '';
  listaParaRenderizar.forEach(p => {
    // Calcular Status do Prazo (Inteligência de Cor)
    let prazoBadge = '';
    if (p.data_termino_prevista) {
      const previsao = new Date(p.data_termino_prevista);
      const hoje = new Date();
      const diffTime = previsao - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        prazoBadge = '<span class="status-badge red">Atrasado</span>';
      } else if (diffDays <= 7) {
        prazoBadge = `<span class="status-badge yellow">${diffDays} dias restantes</span>`;
      } else {
        prazoBadge = '<span class="status-badge green">No prazo</span>';
      }
    }

    html += `
      <div class="project-card" onclick="viewProject(${p.id})">
        <h3>${p.nome} ${prazoBadge}</h3>
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
          <button class="btn btn-secondary" onclick="event.stopPropagation(); gerarRelatorioProjeto(${p.id})">📄 Relatório</button>
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
  // Salva global para referência na edição
  window.loadedAtividades = atividades;

  // Limpar as colunas do Kanban
  const colPendente = document.getElementById('list-pendente');
  const colAndamento = document.getElementById('list-em_andamento');
  const colRevisao = document.getElementById('list-revisao');
  const colConcluida = document.getElementById('list-concluida');

  if(!colPendente) return; // Segurança pra caso não esteja na tela

  colPendente.innerHTML = '';
  colAndamento.innerHTML = '';
  colRevisao.innerHTML = '';
  colConcluida.innerHTML = '';

  // Se não houver atividades cadastradas no banco, vamos colocar umas de "Exemplo/Tour" para mostrar o quadro!
  if (atividades.length === 0) {
    atividades = [
      { id: 'demo1', titulo: 'Comprar Cimento e Areia', descricao: 'Cotar preços em 3 fornecedores diferentes.', prioridade: 'Alta', status: 'pendente', data_vencimento: '2026-03-30', responsavel_nome: 'Vicente Souza', projeto_id: 1, projeto: 'Casa Vila Mariana' },
      { id: 'demo2', titulo: 'Ajeitar Fundação', descricao: 'Preparar o terreno para sapatas.', prioridade: 'Normal', status: 'andamento', data_vencimento: '2026-04-10', responsavel_nome: 'Francisco', projeto_id: 1, projeto: 'Casa Vila Mariana' },
      { id: 'demo3', titulo: 'Aprovar Planta', descricao: 'Revisar o projeto elétrico com o arquiteto.', prioridade: 'Baixa', status: 'revisao', data_vencimento: '2026-03-25', responsavel_nome: 'Engenheiro Teste', projeto_id: 1, projeto: 'Casa Vila Mariana' },
      { id: 'demo4', titulo: 'Limpeza do Terreno', descricao: 'Remoção de entulhos e mato do lote.', prioridade: 'Normal', status: 'concluida', data_vencimento: '2026-03-20', responsavel_nome: 'Vicente Souza', projeto_id: 1, projeto: 'Casa Vila Mariana' }
    ];
    window.loadedAtividades = atividades;
  }

  atividades.forEach(a => {
    // 1. Gera informações do Avatar do Responsável
    const responsavelNome = a.responsavel_nome || 'Sem Categoria'; 
    const iniciais = (responsavelNome !== 'Sem Categoria') ? responsavelNome.substring(0,2).toUpperCase() : '👤';

    // 2. Cor da Etiqueta (Baseado em Prioridade. Assumindo propriedades fictícias que podemos definir no BD)
    let prioriColor = 'tag-blue'; 
    let prioriNome = a.prioridade || 'Normal';
    if(prioriNome.toLowerCase() === 'alta' || prioriNome.toLowerCase() === 'urgente') prioriColor = 'tag-red';
    if(prioriNome.toLowerCase() === 'baixa') prioriColor = 'tag-green';

    // 3. Montar o Card estilo Trello
    let cardHtml = `
      <div class="kanban-card" draggable="true" data-id="${a.id}" 
           ondragstart="arrastarCartao(event)" 
           ondragend="finalizarArrastarCartao(event)"
           onclick="abrirModalEdicaoAtividade('${a.id}')">
        <div class="kanban-tags">
          <span class="kanban-tag ${prioriColor}">${prioriNome.toUpperCase()}</span>
          <span class="kanban-tag tag-yellow" style="background:#e0e0e0; color:#444; max-width:120px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${a.projeto}</span>
        </div>
        <h4 style="margin: 5px 0;">${a.titulo}</h4>
        <p style="font-size: 11px; color: #666; margin-bottom: 10px;">${a.descricao ? a.descricao.substring(0, 40) + '...' : '<i>Sem detalhes</i>'}</p>
        <div class="kanban-footer">
          <div class="kanban-date">🗓️ ${a.data_vencimento ? a.data_vencimento.split('T')[0] : 'S/ Data'}</div>
          <div class="kanban-user" title="Responsável: ${responsavelNome}">${iniciais}</div>
        </div>
      </div>
    `;

    // 4. Distribuir nas colunas corretas baseado no Status
    const status = (a.status || '').toLowerCase();
    
    if (status.includes('concluid') || status.includes('concluíd') || status === 'done') {
      colConcluida.innerHTML += cardHtml;
    } else if (status.includes('andamento') || status.includes('fazendo') || status === 'doing') {
      colAndamento.innerHTML += cardHtml;
    } else if (status.includes('revisao') || status.includes('revisão') || status.includes('teste') || status === 'review') {
      colRevisao.innerHTML += cardHtml;
    } else {
      colPendente.innerHTML += cardHtml; // Pendente ou Qualquer outro vai para To Do
    }
  });
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

// ===== NOTIFICAÇÕES TOAST (LEVES E MODERNAS) =====
function showAlert(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Criar contêiner se não existir
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // Criar o balão de Toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Escolher o ícone baseado no tipo para ficar bonito
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span>${icon} ${message}</span>`;
  
  toastContainer.appendChild(toast);

  // Remover sozinho depois de 3 segundos
  setTimeout(() => {
    toast.style.animation = 'fadeOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
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
  
  if(projeto) {
    if(document.getElementById('editNome')) document.getElementById('editNome').value = projeto.nome || '';
    if(document.getElementById('editLocalizacao')) document.getElementById('editLocalizacao').value = projeto.localizacao || '';
    if(document.getElementById('editTipo')) document.getElementById('editTipo').value = projeto.tipo || '';
    if(document.getElementById('editDataInicio')) document.getElementById('editDataInicio').value = projeto.data_inicio ? projeto.data_inicio.split('T')[0] : '';
    if(document.getElementById('editDataPrevista')) document.getElementById('editDataPrevista').value = projeto.data_termino_prevista ? projeto.data_termino_prevista.split('T')[0] : '';
    if(document.getElementById('editOrcamentoTotal')) document.getElementById('editOrcamentoTotal').value = projeto.orcamento_total || '';

    if(document.getElementById('editProgresso')) document.getElementById('editProgresso').value = projeto.porcentagem_concluida || 0;
    if(document.getElementById('editOrcamento')) document.getElementById('editOrcamento').value = projeto.orcamento_gasto || '';
    if(document.getElementById('editMeta')) document.getElementById('editMeta').value = projeto.descricao || '';
    
    const statusEl = document.getElementById('editStatus');
    if(statusEl && projeto.status) statusEl.value = projeto.status;
  }

  modal.classList.add('active');
};

// ===== FUNÇÕES DE UPLOAD DE FOTOS/DOCUMENTOS =====
function simularUploadArquivos() {
  const fileUpload = document.getElementById('fileUpload');
  const progressBar = document.getElementById('uploadProgress');
  const progressBarElement = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const files = fileUpload.files;
  
  if (files.length === 0) return;
  
  progressBar.style.display = 'block';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress > 100) progress = 100;
    
    progressBarElement.style.width = progress + '%';
    progressText.textContent = `Enviando... ${Math.round(progress)}%`;
    
    if (progress === 100) {
      clearInterval(interval);
      
      setTimeout(() => {
        progressBar.style.display = 'none';
        progressBarElement.style.width = '0%';
        
        // Adicionar arquivos à galeria
        for (let file of files) {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const galeria = document.getElementById('fotosGaleria');
              galeria.innerHTML += `
                <div style="position: relative; border-radius: 6px; overflow: hidden; cursor: pointer; background: #f0f0f0; aspect-ratio: 1;">
                  <img src="${e.target.result}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover;" onclick="visualizarFoto('${e.target.result}')">
                  <button onclick="removerFoto(this)" style="position: absolute; top: 5px; right: 5px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 16px;">×</button>
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 5px; font-size: 10px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${file.name}</div>
                </div>
              `;
            };
            reader.readAsDataURL(file);
          } else if (file.type === 'application/pdf') {
            const documentos = document.getElementById('documentosLista');
            documentos.innerHTML += `
              <div style="padding: 12px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                  <span style="font-size: 24px;">📄</span>
                  <div>
                    <div style="font-weight: 600; font-size: 13px;">${file.name}</div>
                    <small style="color: #999;">${(file.size / 1024).toFixed(2)} KB</small>
                  </div>
                </div>
                <div style="display: flex; gap: 5px;">
                  <button onclick="baixarDocumento('${file.name}')" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">⬇️ Baixar</button>
                  <button onclick="removerDocumento(this)" style="padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️</button>
                </div>
              </div>
            `;
          }
        }
        
        showAlert('✅ ' + files.length + ' arquivo(s) adicionado(s) com sucesso!', 'success');
        fileUpload.value = '';
      }, 500);
    }
  }, 100);
}

function visualizarFoto(src) {
  const modal = document.getElementById('photoViewerModal');
  const img = document.getElementById('photoViewerImage');
  img.src = src;
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
}

function removerFoto(btn) {
  btn.parentElement.remove();
  showAlert('✅ Foto removida', 'success');
}

function removerDocumento(btn) {
  btn.parentElement.parentElement.remove();
  showAlert('✅ Documento removido', 'success');
}

function baixarDocumento(nome) {
  showAlert('✅ Download do documento: ' + nome, 'success');
}

window.salvarFotoDoc = function() {
  showAlert('✅ Foto/Documento salvo com sucesso no projeto (Simulação interna concluída)', 'success');
  window.closeModal(document.getElementById('fotosModal'));
};

window.salvarEdicaoProjeto = async function() {
  const meta = document.getElementById('editMeta').value;
  const progresso = document.getElementById('editProgresso').value;
  const statusEl = document.getElementById('editStatus');
  const orcamentoEl = document.getElementById('editOrcamento');
  
  const nomeEl = document.getElementById('editNome');
  const localizacaoEl = document.getElementById('editLocalizacao');
  const tipoEl = document.getElementById('editTipo');
  const dataInicioEl = document.getElementById('editDataInicio');
  const dataPrevistaEl = document.getElementById('editDataPrevista');
  const orcamentoTotalEl = document.getElementById('editOrcamentoTotal');

  if(projetoEditandoId) {
    const projeto = projetos.find(p => p.id == projetoEditandoId);
    if(projeto) {
      const payload = {
        nome: nomeEl && nomeEl.value ? nomeEl.value : projeto.nome,
        descricao: meta ? meta : projeto.descricao, 
        localizacao: localizacaoEl && localizacaoEl.value ? localizacaoEl.value : projeto.localizacao,
        tipo: tipoEl && tipoEl.value ? tipoEl.value : projeto.tipo,
        data_inicio: dataInicioEl && dataInicioEl.value ? dataInicioEl.value : projeto.data_inicio,
        data_termino_prevista: dataPrevistaEl && dataPrevistaEl.value ? dataPrevistaEl.value : projeto.data_termino_prevista,
        orcamento_total: orcamentoTotalEl && orcamentoTotalEl.value ? parseFloat(orcamentoTotalEl.value) : projeto.orcamento_total,
        status: statusEl && statusEl.value ? statusEl.value : projeto.status,
        porcentagem_concluida: progresso ? parseInt(progresso) : projeto.porcentagem_concluida,
        orcamento_gasto: orcamentoEl && orcamentoEl.value ? parseFloat(orcamentoEl.value) : projeto.orcamento_gasto,
        data_termino_real: projeto.data_termino_real
      };

      try {
        const response = await fetch(`${API_URL}/projetos/${projeto.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          projeto.nome = payload.nome;
          projeto.localizacao = payload.localizacao;
          projeto.tipo = payload.tipo;
          projeto.data_inicio = payload.data_inicio;
          projeto.data_termino_prevista = payload.data_termino_prevista;
          projeto.orcamento_total = payload.orcamento_total;
          projeto.porcentagem_concluida = payload.porcentagem_concluida;
          projeto.status = payload.status;
          projeto.descricao = payload.descricao;
          projeto.orcamento_gasto = payload.orcamento_gasto;
          
          renderProjetos();
          loadDashboard(); 
        } else {
          showAlert('Erro ao atualizar banco de dados.', 'error');
        }
      } catch (err) {
        showAlert('Erro de conexão ao salvar.', 'error');
      }
    }
  }

  window.closeModal(document.getElementById('editProjetoModal'));
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
      labels: ['Em Andamento', 'Pendências', 'Finalizados', 'Planejamento'],
      datasets: [{
        label: 'Desempenho Atual',
        data: [andamento, pendentes, entregues, (total - andamento)], 
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)', // Azul Moderno
          'rgba(231, 76, 60, 0.7)',  // Vermelho
          'rgba(46, 204, 113, 0.7)', // Verde
          'rgba(241, 196, 15, 0.7)'  // Amarelo
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(231, 76, 60, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(241, 196, 15, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,            // Bordas mais arredondadas
        barPercentage: 0.6,         // Barras mais compactas e elegantes
        hoverBackgroundColor: [     // Efeito visual ao passar o mouse
          'rgba(52, 152, 219, 1)',
          'rgba(231, 76, 60, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(241, 196, 15, 1)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,             // Animação super suave ao carregar
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { 
          display: true,
          position: 'top',
          labels: { 
            color: textColor, 
            font: { size: 13, family: "system-ui, -apple-system, sans-serif", weight: '600' },
            usePointStyle: true,    // Ícones em formato de bolinha na legenda
            padding: 20
          } 
        },
        tooltip: { 
          backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#ffffff' : '#2c3e50',
          bodyColor: isDark ? '#dddddd' : '#555555',
          borderColor: isDark ? '#444444' : '#e0e0e0',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          usePointStyle: true,
          titleFont: { size: 14, family: "system-ui", weight: 'bold' },
          bodyFont: { size: 13, family: "system-ui", weight: '500' },
          boxPadding: 8
        }
      },
      scales: {
        y: { 
          beginAtZero: true, 
          ticks: { color: textColor, font: { size: 12 } }, 
          grid: { 
            color: gridColor, 
            borderDash: [5, 5],     // Linhas pontilhadas (estilo dashboard premium)
            drawBorder: false 
          } 
        },
        x: { 
          ticks: { color: textColor, font: { size: 13, weight: '600' } }, 
          grid: { display: false, drawBorder: false } 
        }
      }
    }
  });
};

window.gerarRelatorioProjeto = function(projId) {
  const p = projetos.find(proj => proj.id == projId);
  if (!p) {
    showAlert('Projeto não encontrado!', 'error');
    return;
  }
  
  // Creates a temporary div to render the report
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Relatório de Projeto</h1>
      <h2>${p.nome}</h2>
      <p><strong>📍 Localização:</strong> ${p.localizacao}</p>
      <p><strong>Tipo:</strong> ${p.tipo}</p>
      <p><strong>Status:</strong> ${p.status}</p>
      <p><strong>Progresso:</strong> ${p.porcentagem_concluida || 0}%</p>
      
      <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #3498db; background-color: #f8f9fa;">
        <h3 style="margin-top: 0; color: #2980b9;">Financeiro</h3>
        <p><strong>Orçamento Total:</strong> R$ ${(p.orcamento_total || 0).toFixed(2)}</p>
        <p><strong>Orçamento Gasto:</strong> R$ ${(p.orcamento_gasto || 0).toFixed(2)}</p>
      </div>
      
      <div style="margin-top: 20px;">
        <h3 style="color: #2980b9;">Descrição/Meta Atual</h3>
        <p>${p.descricao || 'Nenhuma descrição fornecida.'}</p>
      </div>

      <div style="margin-top: 40px; font-size: 12px; color: #7f8c8d; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
        Gerado pelo Gerenciador de Tarefas 2.0 em ${new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>
  `;

  const opt = {
    margin:       10,
    filename:     `Relatorio_${p.nome.replace(/\s+/g, '_')}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  showAlert('⏳ Gerando relatório PDF...', 'info');
  html2pdf().set(opt).from(content).save().then(() => {
    showAlert('✅ Relatório baixado com sucesso!', 'success');
  });
};
document.addEventListener('DOMContentLoaded', init);

// LÓGICA DO MODAL DE ATIVIDADES E INTEGRAÇÃO KANBAN
document.addEventListener('DOMContentLoaded', () => {
  const newActivityBtn = document.getElementById('newActivityBtn');
  const activityModal = document.getElementById('activityModal');
  const closeActivityModal = document.getElementById('closeActivityModal');
  const cancelActivityBtn = document.getElementById('cancelActivityBtn');
  const activityForm = document.getElementById('activityForm');
  const actProjeto = document.getElementById('actProjeto');
  
  if(newActivityBtn) {
    newActivityBtn.addEventListener('click', () => {
      document.getElementById('activityModalTitle').textContent = 'Nova Atividade';
      activityForm.reset();
      document.getElementById('editActivityId').value = '';
      
      // Carregar projetos no select
      if(typeof projetos !== 'undefined' && actProjeto) {
        actProjeto.innerHTML = '<option value="">Selecione um Projeto...</option>' + 
          projetos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
      }
      
      activityModal.classList.add('active');
    });
  }

  const fecharOuCancelar = () => { if(activityModal) activityModal.classList.remove('active'); };
  if(closeActivityModal) closeActivityModal.addEventListener('click', fecharOuCancelar);
  if(cancelActivityBtn) cancelActivityBtn.addEventListener('click', fecharOuCancelar);

  // Quando escolhe o projeto, tentar carregar as fases dele pro select
  if(actProjeto) {
    actProjeto.addEventListener('change', async (e) => {
      const projId = e.target.value;
      const actFase = document.getElementById('actFase');
      if(!projId) {
        actFase.innerHTML = '<option value="">Selecione primeiro o projeto...</option>';
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/projetos/${projId}/fases`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if(response.ok) {
          const fases = await response.json();
          if(fases.length > 0) {
            actFase.innerHTML = fases.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
          } else {
            // mock para teste do professor se nao tiver fase
            actFase.innerHTML = `<option value="1">Fase Principal (Padrão)</option>`;
          }
        }
      } catch(err) {
        console.error(err);
      }
    });
  }

  // Submit do form
  if(activityForm) {
    activityForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('editActivityId').value;
      const fase_id = document.getElementById('actFase').value || 1; // 1 de fallback
      
      const data = {
        titulo: document.getElementById('actTitulo').value,
        descricao: document.getElementById('actDescricao').value,
        fase_id: fase_id, // Atrelado ao backend
        status: document.getElementById('actStatus').value,
        prioridade: document.getElementById('actPrioridade').value,
        data_vencimento: document.getElementById('actVencimento').value,
        responsavel_nome: document.getElementById('actResponsavel').value // Pode precisar ser adaptado no backend se for responsavel_id
      };

      try {
        let response;
        if(id && id !== '' && !id.startsWith('demo')) {
          // Edição
          response = await fetch(`${API_URL}/atividades/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
          });
        } else {
          // Criação (ou atualização local para mockup se for demo)
          if(id && id.startsWith('demo')) {
              // Só fecha no demo local
              fecharOuCancelar();
              alert("Editado visualmente (No mockup de API).");
              return;
          }

          response = await fetch(`${API_URL}/atividades`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
          });
        }

        if(response && response.ok) {
          fecharOuCancelar();
          if(typeof loadAtividades === 'function') loadAtividades(); // recarrega e re-renderiza
        } else {
          alert('Erro ao salvar atividade. Talvez falte preencher algo ou criar as fases.');
        }
      } catch(e) {
        console.error(e);
      }
    });
  }
});

// Função global para abrir o modal em modo de edição
window.abrirModalEdicaoAtividade = function(id) {
  const atividade = (window.loadedAtividades || []).find(a => a.id == id);
  if(!atividade) return;
  
  document.getElementById('activityModalTitle').textContent = 'Editar Atividade';
  document.getElementById('editActivityId').value = atividade.id;
  
  document.getElementById('actTitulo').value = atividade.titulo || '';
  document.getElementById('actDescricao').value = atividade.descricao || '';
  
  if (atividade.status) {
    let lowerStatus = atividade.status.toLowerCase();
    if (lowerStatus.includes('concluid')) lowerStatus = 'concluida';
    else if (lowerStatus.includes('andamento') || lowerStatus.includes('fazendo')) lowerStatus = 'andamento';
    else if (lowerStatus.includes('revisao')) lowerStatus = 'revisao';
    else lowerStatus = 'pendente';
    document.getElementById('actStatus').value = lowerStatus;
  }
  
  document.getElementById('actPrioridade').value = atividade.prioridade || 'Normal';
  document.getElementById('actVencimento').value = atividade.data_vencimento ? atividade.data_vencimento.split('T')[0] : '';
  document.getElementById('actResponsavel').value = atividade.responsavel_nome || '';
  
  // Setar o projeto
  const actProjeto = document.getElementById('actProjeto');
  if(actProjeto) {
    actProjeto.innerHTML = '<option value="">Selecione um Projeto...</option>' + 
          projetos.map(p => `<option value="${p.id}" ${p.id == atividade.projeto_id ? 'selected' : ''}>${p.nome}</option>`).join('');
          
    // Simular o evento de change para carregar as fases, ou setar uma fake se nao deu
    if(atividade.projeto_id) {
      actProjeto.dispatchEvent(new Event('change'));
      setTimeout(() => {
        const actFase = document.getElementById('actFase');
        if(atividade.fase_id && actFase.querySelector(`option[value="${atividade.fase_id}"]`)){
           actFase.value = atividade.fase_id;
        } else {
           // mock para teste do professor se nao tiver fase
           actFase.innerHTML += `<option value="1" selected>Fase Mantida (Padrão)</option>`;
        }
      }, 500);
    }
  }

  document.getElementById('activityModal').classList.add('active');
};

// ----------------------------------------------------
// DRAG AND DROP - KANBAN DYNAMICS
// ----------------------------------------------------
window.arrastarCartao = function(event) {
  event.dataTransfer.setData("text", event.target.getAttribute('data-id'));
  event.target.style.opacity = '0.5';
}

window.finalizarArrastarCartao = function(event) {
  event.target.style.opacity = '1';
}

window.permitirSoltar = function(event) {
  event.preventDefault();
}

window.destacarColuna = function(event) {
  const col = event.target.closest('.kanban-column');
  if(col) col.classList.add('drag-over');
}

window.removerDestaqueColuna = function(event) {
  const col = event.target.closest('.kanban-column');
  if(col) col.classList.remove('drag-over');
}

window.soltarCartao = async function(event, novoStatus) {
  event.preventDefault();
  const col = event.target.closest('.kanban-column');
  if(col) col.classList.remove('drag-over');

  const idAtividade = event.dataTransfer.getData("text");
  if(!idAtividade) return;

  // Atualiza visualmente primeiro (Otimista)
  const cartaoElement = document.querySelector(`.kanban-card[data-id="\${idAtividade}"]`);
  let listElement = document.getElementById(`list-\${novoStatus}`);
  if(!listElement && novoStatus === 'andamento') listElement = document.getElementById('list-em_andamento');

  if(cartaoElement && listElement) {
    listElement.appendChild(cartaoElement);
  }

  // Faz a chamada na API se não for dado de demonstração
  if(idAtividade.startsWith('demo')) {
    console.log("Mock drag and drop ok.");
    return;
  }

  try {
    const data = { status: novoStatus };
    const res = await fetch(`\${API_URL}/atividades/\${idAtividade}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer \${authToken}`
      },
      body: JSON.stringify(data)
    });
    
    if(!res.ok) {
       console.error("Erro ao atualizar no backend. Recarregando Atividades...");
       if(typeof loadAtividades === 'function') loadAtividades();
    }
  } catch(e) {
    console.error("Erro na request:", e);
  }
}

window.abrirModalNovaAtividadeStatus = function(statusDesejado) {
  document.getElementById('newActivityBtn').click();
  // Da um tempo pro modal abrir e depois seta o status programaticamente
  setTimeout(() => {
    let select = document.getElementById('actStatus');
    if(select) select.value = statusDesejado === 'andamento' ? 'em_andamento' : statusDesejado;
  }, 150);
}
