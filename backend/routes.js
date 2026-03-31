import express from 'express';
import db from './database.js';
import { verificarToken, verificarRole } from './auth.js';
import { login, registrar, listarUsuarios, obterPerfil } from './controllers.js';
import {
  criarProjeto, listarProjetos, obterProjeto, atualizarProjeto, deletarProjeto,
  criarFase, listarFases, atualizarFase, deletarFase,
  criarAtividade, listarAtividades, atualizarAtividade, deletarAtividade,
  criarMaterial, listarMateriais, atualizarMaterial, deletarMaterial,
  obterDashboard, obterEstatisticasProjeto
} from './projectControllers.js';

const router = express.Router();

// ====== AUTENTICAÇÃO ======
router.post('/auth/login', login);
router.post('/auth/registrar', registrar);
router.get('/usuario/perfil', verificarToken, obterPerfil);
router.get('/usuarios', verificarToken, verificarRole(['admin']), listarUsuarios);
router.get('/usuarios/lista/equipe', verificarToken, listarUsuarios); // Rota pública pra chat

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

// ====== PROJETOS - CRUD (Novo) ======
router.post('/projetos', verificarToken, verificarRole(['admin', 'gerente', 'engenheiro']), criarProjeto);
router.get('/projetos', verificarToken, listarProjetos);
router.get('/projetos/:id', verificarToken, obterProjeto);
router.put('/projetos/:id', verificarToken, verificarRole(['admin', 'gerente', 'engenheiro']), atualizarProjeto);
router.delete('/projetos/:id', verificarToken, verificarRole(['admin', 'gerente']), deletarProjeto);

// ====== FASES - CRUD ======
router.post('/fases', verificarToken, verificarRole(['admin', 'gerente', 'engenheiro']), criarFase);
router.get('/projetos/:projeto_id/fases', verificarToken, listarFases);
router.put('/fases/:id', verificarToken, verificarRole(['admin', 'gerente', 'engenheiro']), atualizarFase);
router.delete('/fases/:id', verificarToken, verificarRole(['admin', 'gerente']), deletarFase);

// ====== ATIVIDADES - CRUD ======
router.post('/atividades', verificarToken, verificarRole(['admin', 'gerente', 'engenheiro', 'tecnico']), criarAtividade);
router.get('/fases/:fase_id/atividades', verificarToken, listarAtividades);
router.put('/atividades/:id', verificarToken, atualizarAtividade);
router.delete('/atividades/:id', verificarToken, verificarRole(['admin', 'gerente']), deletarAtividade);

// ====== MATERIAIS - CRUD ======
router.post('/materiais', verificarToken, verificarRole(['admin', 'gerente', 'engenheiro']), criarMaterial);
router.get('/projetos/:projeto_id/materiais', verificarToken, listarMateriais);
router.put('/materiais/:id', verificarToken, verificarRole(['admin', 'gerente']), atualizarMaterial);
router.delete('/materiais/:id', verificarToken, verificarRole(['admin', 'gerente']), deletarMaterial);

// ====== DASHBOARD / ESTATÍSTICAS (Novo) ======
router.get('/dashboard', verificarToken, obterDashboard);
router.get('/projetos/:projeto_id/estatisticas', verificarToken, obterEstatisticasProjeto);

export default router;
