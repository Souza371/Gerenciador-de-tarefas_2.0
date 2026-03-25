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
  // Tabela de Usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      senha TEXT NOT NULL,
      role TEXT DEFAULT 'cliente',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Tarefas
  db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT,
      usuario_id INTEGER NOT NULL,
      categoria TEXT DEFAULT 'geral',
      status TEXT DEFAULT 'pendente',
      prioridade TEXT DEFAULT 'media',
      data_vencimento DATE,
      concluida INTEGER DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);

  // Inserir usuários de teste
  const usuarios = [
    { email: 'vicentedesouza762@gmail.com', nome: 'Vicente de Souza', senha: 'Admin@2026', role: 'admin' },
    { email: 'francisco@projeto.com', nome: 'Francisco Silva', senha: 'Admin@2026', role: 'admin' },
    { email: 'professor@projeto.com', nome: 'Professor Orientador', senha: 'Admin@2026', role: 'admin' },
    { email: 'gerenteteste@projeto.com', nome: 'Gerente Teste', senha: 'Gerente@123', role: 'gerente' },
    { email: 'engenheiroteste@projeto.com', nome: 'Engenheiro Teste', senha: 'Engenheiro@123', role: 'engenheiro' },
    { email: 'tecnicoteste@projeto.com', nome: 'Técnico Teste', senha: 'Tecnico@123', role: 'tecnico' },
    { email: 'clienteteste@projeto.com', nome: 'Cliente Teste', senha: 'Cliente@123', role: 'cliente' }
  ];

  usuarios.forEach(user => {
    const senhaHash = bcryptjs.hashSync(user.senha, 10);
    db.run(
      'INSERT OR IGNORE INTO usuarios (email, nome, senha, role) VALUES (?, ?, ?, ?)',
      [user.email, user.nome, senhaHash, user.role],
      function(err) {
        if (err) console.error(`Erro ao inserir ${user.email}:`, err);
        else console.log(`✓ Usuário criado: ${user.email} (${user.role})`);
      }
    );
  });
});

export default db;
