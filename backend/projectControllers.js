import db from './database.js';

// ===== PROJETOS =====

export const criarProjeto = (req, res) => {
  const { nome, descricao, localizacao, tipo, data_inicio, data_termino_prevista, orcamento_total } = req.body;
  const responsavel_id = req.usuario.id;

  if (!nome || !localizacao || !tipo) {
    return res.status(400).json({ erro: 'Nome, localização e tipo são obrigatórios' });
  }

  db.run(
    `INSERT INTO projetos (nome, descricao, localizacao, tipo, responsavel_id, data_inicio, data_termino_prevista, orcamento_total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, descricao, localizacao, tipo, responsavel_id, data_inicio, data_termino_prevista, orcamento_total],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao criar projeto' });
      res.status(201).json({
        sucesso: true,
        projeto: { id: this.lastID, nome, localizacao, tipo, responsavel_id, status: 'planejamento' }
      });
    }
  );
};

export const listarProjetos = (req, res) => {
  const userId = req.usuario.id;
  const userRole = req.usuario.role;

  let query = 'SELECT * FROM projetos';
  let params = [];

  // Clientes veem apenas seus projetos
  if (userRole === 'cliente') {
    query += ' WHERE responsavel_id = ?';
    params = [userId];
  }

  query += ' ORDER BY criado_em DESC';

  db.all(query, params, (err, projetos) => {
    if (err) return res.status(500).json({ erro: 'Erro ao listar projetos' });
    res.json(projetos || []);
  });
};

export const obterProjeto = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM projetos WHERE id = ?', [id], (err, projeto) => {
    if (err) return res.status(500).json({ erro: 'Erro ao obter projeto' });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });

    // Obter fases
    db.all('SELECT * FROM fases WHERE projeto_id = ? ORDER BY ordem', [id], (err, fases) => {
      if (!err) projeto.fases = fases || [];
      res.json(projeto);
    });
  });
};

export const atualizarProjeto = (req, res) => {
  const { id } = req.params;
  const { 
    nome, descricao, localizacao, tipo, data_inicio, data_termino_prevista, orcamento_total,
    status, porcentagem_concluida, orcamento_gasto, data_termino_real 
  } = req.body;

  db.run(
    `UPDATE projetos SET 
      nome=?, descricao=?, localizacao=?, tipo=?, data_inicio=?, data_termino_prevista=?, orcamento_total=?,
      status=?, porcentagem_concluida=?, orcamento_gasto=?, data_termino_real=?, atualizado_em=CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      nome, descricao, localizacao, tipo, data_inicio, data_termino_prevista, orcamento_total,
      status, porcentagem_concluida, orcamento_gasto, data_termino_real, id
    ],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar projeto' });
      if (this.changes === 0) return res.status(404).json({ erro: 'Projeto não encontrado' });
      res.json({ sucesso: true, mensagem: 'Projeto atualizado' });
    }
  );
};

export const deletarProjeto = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM projetos WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar projeto' });
    if (this.changes === 0) return res.status(404).json({ erro: 'Projeto não encontrado' });
    res.json({ sucesso: true, mensagem: 'Projeto deletado' });
  });
};

// ===== FASES =====

export const criarFase = (req, res) => {
  const { projeto_id, nome, descricao, ordem, data_inicio, data_termino_prevista } = req.body;

  if (!projeto_id || !nome) {
    return res.status(400).json({ erro: 'Projeto e nome da fase são obrigatórios' });
  }

  db.run(
    `INSERT INTO fases (projeto_id, nome, descricao, ordem, data_inicio, data_termino_prevista)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [projeto_id, nome, descricao, ordem, data_inicio, data_termino_prevista],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao criar fase' });
      res.status(201).json({
        sucesso: true,
        fase: { id: this.lastID, projeto_id, nome, status: 'nao_iniciada' }
      });
    }
  );
};

export const listarFases = (req, res) => {
  const { projeto_id } = req.params;

  db.all('SELECT * FROM fases WHERE projeto_id = ? ORDER BY ordem', [projeto_id], (err, fases) => {
    if (err) return res.status(500).json({ erro: 'Erro ao listar fases' });
    res.json(fases || []);
  });
};

export const atualizarFase = (req, res) => {
  const { id } = req.params;
  const { nome, status, porcentagem, data_conclusao } = req.body;

  db.run(
    `UPDATE fases SET nome=?, status=?, porcentagem=?, data_conclusao=?
     WHERE id = ?`,
    [nome, status, porcentagem, data_conclusao, id],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar fase' });
      if (this.changes === 0) return res.status(404).json({ erro: 'Fase não encontrada' });
      res.json({ sucesso: true, mensagem: 'Fase atualizada' });
    }
  );
};

export const deletarFase = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM fases WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar fase' });
    if (this.changes === 0) return res.status(404).json({ erro: 'Fase não encontrada' });
    res.json({ sucesso: true, mensagem: 'Fase deletada' });
  });
};

// ===== ATIVIDADES =====

export const criarAtividade = (req, res) => {
  const { fase_id, titulo, descricao, responsavel_id, prioridade, data_inicio, data_vencimento } = req.body;

  if (!fase_id || !titulo) {
    return res.status(400).json({ erro: 'Fase e título são obrigatórios' });
  }

  db.run(
    `INSERT INTO atividades (fase_id, titulo, descricao, responsavel_id, prioridade, data_inicio, data_vencimento)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [fase_id, titulo, descricao, responsavel_id, prioridade, data_inicio, data_vencimento],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao criar atividade' });
      res.status(201).json({
        sucesso: true,
        atividade: { id: this.lastID, fase_id, titulo, status: 'pendente' }
      });
    }
  );
};

export const listarAtividades = (req, res) => {
  const { fase_id } = req.params;

  db.all('SELECT * FROM atividades WHERE fase_id = ? ORDER BY data_vencimento', [fase_id], (err, atividades) => {
    if (err) return res.status(500).json({ erro: 'Erro ao listar atividades' });
    res.json(atividades || []);
  });
};

export const atualizarAtividade = (req, res) => {
  const { id } = req.params;
  const { titulo, status, concluida, observacoes } = req.body;

  db.run(
    `UPDATE atividades SET titulo=?, status=?, concluida=?, observacoes=?
     WHERE id = ?`,
    [titulo, status, concluida, observacoes, id],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar atividade' });
      if (this.changes === 0) return res.status(404).json({ erro: 'Atividade não encontrada' });
      res.json({ sucesso: true, mensagem: 'Atividade atualizada' });
    }
  );
};

export const deletarAtividade = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM atividades WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar atividade' });
    if (this.changes === 0) return res.status(404).json({ erro: 'Atividade não encontrada' });
    res.json({ sucesso: true, mensagem: 'Atividade deletada' });
  });
};

// ===== MATERIAIS =====

export const criarMaterial = (req, res) => {
  const { projeto_id, nome, quantidade, unidade, valor_unitario, fornecedor, data_entrega } = req.body;

  if (!projeto_id || !nome || !quantidade) {
    return res.status(400).json({ erro: 'Projeto, nome e quantidade são obrigatórios' });
  }

  const valor_total = (quantidade * valor_unitario) || 0;

  db.run(
    `INSERT INTO materiais (projeto_id, nome, quantidade, unidade, valor_unitario, valor_total, fornecedor, data_entrega)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [projeto_id, nome, quantidade, unidade, valor_unitario, valor_total, fornecedor, data_entrega],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao criar material' });
      res.status(201).json({
        sucesso: true,
        material: { id: this.lastID, projeto_id, nome, status: 'pedido' }
      });
    }
  );
};

export const listarMateriais = (req, res) => {
  const { projeto_id } = req.params;

  db.all('SELECT * FROM materiais WHERE projeto_id = ?', [projeto_id], (err, materiais) => {
    if (err) return res.status(500).json({ erro: 'Erro ao listar materiais' });
    res.json(materiais || []);
  });
};

export const atualizarMaterial = (req, res) => {
  const { id } = req.params;
  const { status, data_entrega } = req.body;

  db.run(
    `UPDATE materiais SET status=?, data_entrega=?
     WHERE id = ?`,
    [status, data_entrega, id],
    function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar material' });
      if (this.changes === 0) return res.status(404).json({ erro: 'Material não encontrado' });
      res.json({ sucesso: true, mensagem: 'Material atualizado' });
    }
  );
};

export const deletarMaterial = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM materiais WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar material' });
    if (this.changes === 0) return res.status(404).json({ erro: 'Material não encontrado' });
    res.json({ sucesso: true, mensagem: 'Material deletado' });
  });
};

// ===== DASHBOARD / ESTATÍSTICAS =====

export const obterEstatisticasProjeto = (req, res) => {
  const { projeto_id } = req.params;

  db.get(
    `SELECT 
      COUNT(*) as total_projetos,
      SUM(CASE WHEN status='em_andamento' THEN 1 ELSE 0 END) as projetos_em_andamento,
      SUM(CASE WHEN status='concluido' THEN 1 ELSE 0 END) as projetos_concluidos,
      AVG(porcentagem_concluida) as porcentagem_media
     FROM projetos WHERE id = ?`,
    [projeto_id],
    (err, stats) => {
      if (err) return res.status(500).json({ erro: 'Erro ao obter estatísticas' });

      // Obter fases
      db.all(
        `SELECT status, COUNT(*) as quantidade FROM fases WHERE projeto_id = ? GROUP BY status`,
        [projeto_id],
        (err, fases) => {
          if (!err && stats) {
            stats.fases = fases || [];
          }
          res.json(stats || {});
        }
      );
    }
  );
};

export const obterDashboard = (req, res) => {
  const userId = req.usuario.id;

  // Total de projetos
  db.get('SELECT COUNT(*) as total FROM projetos', (err, totalProjetos) => {
    // Projetos em andamento
    db.get('SELECT COUNT(*) as total FROM projetos WHERE status="em_andamento"', (err, projetosEmAndamento) => {
      // Atividades pendentes
      db.get('SELECT COUNT(*) as total FROM atividades WHERE status="pendente"', (err, atividadesPendentes) => {
        // Materiais entregues
        db.get('SELECT COUNT(*) as total FROM materiais WHERE status="entregue"', (err, materiaisEntregues) => {
          res.json({
            totalProjetos: totalProjetos?.total || 0,
            projetosEmAndamento: projetosEmAndamento?.total || 0,
            atividadesPendentes: atividadesPendentes?.total || 0,
            materiaisEntregues: materiaisEntregues?.total || 0
          });
        });
      });
    });
  });
};
