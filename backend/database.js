import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcryptjs from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'tasks.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Erro ao conectar BD:', err);
  else console.log('✓ SQLite conectado');
});

db.serialize(() => {
  // ===== TABELA DE USUÁRIOS =====
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      telefone TEXT,
      senha TEXT NOT NULL,
      role TEXT DEFAULT 'cliente',
      profissao TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ===== TABELA DE PROJETOS =====
  db.run(`
    CREATE TABLE IF NOT EXISTS projetos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      localizacao TEXT NOT NULL,
      tipo TEXT NOT NULL,
      responsavel_id INTEGER NOT NULL,
      status TEXT DEFAULT 'planejamento',
      data_inicio DATE,
      data_termino_prevista DATE,
      data_termino_real DATE,
      orcamento_total DECIMAL(12,2),
      orcamento_gasto DECIMAL(12,2) DEFAULT 0,
      porcentagem_concluida INTEGER DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(responsavel_id) REFERENCES usuarios(id)
    )
  `);

  // ===== TABELA DE FASES DO PROJETO =====
  db.run(`
    CREATE TABLE IF NOT EXISTS fases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projeto_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT,
      ordem INTEGER,
      status TEXT DEFAULT 'nao_iniciada',
      data_inicio DATE,
      data_termino_prevista DATE,
      data_conclusao DATE,
      porcentagem INTEGER DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
    )
  `);

  // ===== TABELA DE ATIVIDADES =====
  db.run(`
    CREATE TABLE IF NOT EXISTS atividades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fase_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      responsavel_id INTEGER,
      status TEXT DEFAULT 'pendente',
      prioridade TEXT DEFAULT 'media',
      data_inicio DATE,
      data_vencimento DATE,
      concluida INTEGER DEFAULT 0,
      observacoes TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(fase_id) REFERENCES fases(id) ON DELETE CASCADE,
      FOREIGN KEY(responsavel_id) REFERENCES usuarios(id)
    )
  `);

  // ===== TABELA DE MATERIAIS =====
  db.run(`
    CREATE TABLE IF NOT EXISTS materiais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projeto_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT,
      quantidade DECIMAL(10,2),
      unidade TEXT,
      valor_unitario DECIMAL(10,2),
      valor_total DECIMAL(12,2),
      fornecedor TEXT,
      data_entrega DATE,
      status TEXT DEFAULT 'pedido',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
    )
  `);

  // ===== TABELA DE MÃO DE OBRA =====
  db.run(`
    CREATE TABLE IF NOT EXISTS mao_obra (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projeto_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      funcao TEXT NOT NULL,
      data_inicio DATE,
      data_fim DATE,
      valor_diaria DECIMAL(10,2),
      total_dias INTEGER DEFAULT 0,
      valor_total DECIMAL(12,2) DEFAULT 0,
      status TEXT DEFAULT 'ativo',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )
  `);

  // ===== TABELA DE EQUIPAMENTOS =====
  db.run(`
    CREATE TABLE IF NOT EXISTS equipamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projeto_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT,
      tipo TEXT,
      data_locacao DATE,
      data_devolucao DATE,
      valor_diaria DECIMAL(10,2),
      valor_total DECIMAL(12,2),
      fornecedor TEXT,
      status TEXT DEFAULT 'em_uso',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
    )
  `);

  // ===== INSERIR USUÁRIOS DE TESTE =====
  const usuarios = [
    { email: 'vicentedesouza762@gmail.com', nome: 'Vicente de Souza', telefone: '11999999999', senha: 'Admin@2026', role: 'admin', profissao: 'Engenheiro' },
    { email: 'francisco@projeto.com', nome: 'Francisco Silva', telefone: '11988888888', senha: 'Admin@2026', role: 'admin', profissao: 'Engenheiro Chefe' },
    { email: 'professor@projeto.com', nome: 'Professor Orientador', telefone: '11987654321', senha: 'Admin@2026', role: 'admin', profissao: 'Professor' },
    { email: 'gerenteteste@projeto.com', nome: 'Gerente Teste', telefone: '11977777777', senha: 'Gerente@123', role: 'gerente', profissao: 'Gerente de Obra' },
    { email: 'engenheiroteste@projeto.com', nome: 'Engenheiro Teste', telefone: '11966666666', senha: 'Engenheiro@123', role: 'engenheiro', profissao: 'Engenheiro' },
    { email: 'tecnicoteste@projeto.com', nome: 'Técnico Teste', telefone: '11955555555', senha: 'Tecnico@123', role: 'tecnico', profissao: 'Técnico em Segurança' },
    { email: 'clienteteste@projeto.com', nome: 'Cliente Teste', telefone: '11944444444', senha: 'Cliente@123', role: 'cliente', profissao: 'Proprietário' }
  ];

  usuarios.forEach(user => {
    const senhaHash = bcryptjs.hashSync(user.senha, 10);
    db.run(
      'INSERT OR IGNORE INTO usuarios (email, nome, telefone, senha, role, profissao) VALUES (?, ?, ?, ?, ?, ?)',
      [user.email, user.nome, user.telefone, senhaHash, user.role, user.profissao],
      function(err) {
        if (err) console.error(`Erro ao inserir ${user.email}:`, err);
        else console.log(`✓ Usuário criado: ${user.email} (${user.role})`);
      }
    );
  });

  // ===== INSERIR PROJETO DE TESTE =====
  db.run(
    'INSERT OR IGNORE INTO projetos (nome, descricao, localizacao, tipo, responsavel_id, status, data_inicio, data_termino_prevista, orcamento_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ['Casa Residencial - Vila Mariana', 'Construção de casa residencial de 200m²', 'São Paulo, SP', 'residencial', 1, 'em_andamento', '2026-01-15', '2026-09-15', 250000.00],
    function(err) {
      if (err) console.error('Erro ao inserir projeto:', err);
      else console.log('✓ Projeto de teste criado');
    }
  );
});

export default db;
