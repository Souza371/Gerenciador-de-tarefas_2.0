import express from 'express';
import db from './database.js';
import { verificarToken, verificarRole } from './auth.js';
import { login, registrar, listarUsuarios, obterPerfil } from './controllers.js';

const router = express.Router();

// ====== AUTENTICAÇÃO ======
router.post('/auth/login', login);
router.post('/auth/registrar', registrar);
router.get('/usuario/perfil', verificarToken, obterPerfil);
router.get('/usuarios', verificarToken, verificarRole(['admin']), listarUsuarios);

// ====== TAREFAS - CRUD ======

// CRIAR tarefa
router.post('/tarefas', verificarToken, (req, res) => {
  const { titulo, descricao, categoria, prioridade, data_vencimento } = req.body;

  if (!titulo) return res.status(400).json({ erro: 'Título é obrigatório' });

  db.run(
    `INSERT INTO tarefas (titulo, descricao, usuario_id, categoria, prioridade, data_vencimento)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [titulo, descricao || '', req.usuario.id, categoria || 'geral', prioridade || 'media', data_vencimento || null],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao criar tarefa' });
      res.status(201).json({
        id: this.lastID,
        titulo,
        descricao,
        usuario_id: req.usuario.id,
        categoria,
        prioridade,
        data_vencimento,
        status: 'pendente',
        concluida: 0,
        criado_em: new Date().toISOString()
      });
    }
  );
});

// LISTAR tarefas do usuário
router.get('/tarefas', verificarToken, (req, res) => {
  const { status, categoria, prioridade } = req.query;
  let query = 'SELECT * FROM tarefas WHERE usuario_id = ?';
  const params = [req.usuario.id];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (categoria) {
    query += ' AND categoria = ?';
    params.push(categoria);
  }
  if (prioridade) {
    query += ' AND prioridade = ?';
    params.push(prioridade);
  }

  query += ' ORDER BY criado_em DESC';

  db.all(query, params, (err, tarefas) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar tarefas' });
    res.json(tarefas);
  });
});

// OBTER tarefa por ID
router.get('/tarefas/:id', verificarToken, (req, res) => {
  db.get(
    'SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?',
    [req.params.id, req.usuario.id],
    (err, tarefa) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar tarefa' });
      if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
      res.json(tarefa);
    }
  );
});

// ATUALIZAR tarefa
router.put('/tarefas/:id', verificarToken, (req, res) => {
  const { titulo, descricao, categoria, prioridade, status, data_vencimento, concluida } = req.body;

  db.run(
    `UPDATE tarefas 
     SET titulo = ?, descricao = ?, categoria = ?, prioridade = ?, status = ?, data_vencimento = ?, concluida = ?, atualizado_em = CURRENT_TIMESTAMP
     WHERE id = ? AND usuario_id = ?`,
    [titulo, descricao, categoria, prioridade, status, data_vencimento, concluida || 0, req.params.id, req.usuario.id],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar tarefa' });
      if (this.changes === 0) return res.status(404).json({ erro: 'Tarefa não encontrada' });
      res.json({ sucesso: true, mensagem: 'Tarefa atualizada' });
    }
  );
});

// DELETAR tarefa
router.delete('/tarefas/:id', verificarToken, (req, res) => {
  db.run(
    'DELETE FROM tarefas WHERE id = ? AND usuario_id = ?',
    [req.params.id, req.usuario.id],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao deletar tarefa' });
      if (this.changes === 0) return res.status(404).json({ erro: 'Tarefa não encontrada' });
      res.json({ sucesso: true, mensagem: 'Tarefa deletada' });
    }
  );
});

// ESTATÍSTICAS
router.get('/dashboard/stats', verificarToken, (req, res) => {
  db.get(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
      SUM(CASE WHEN status = 'em_progresso' THEN 1 ELSE 0 END) as em_progresso,
      SUM(CASE WHEN concluida = 1 THEN 1 ELSE 0 END) as concluidas
     FROM tarefas WHERE usuario_id = ?`,
    [req.usuario.id],
    (err, stats) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
      res.json(stats);
    }
  );
});

export default router;
