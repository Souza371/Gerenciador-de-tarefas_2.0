import db from './database.js';
import bcryptjs from 'bcryptjs';
import { gerarToken } from './auth.js';

// LOGIN
export const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (!usuario) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const senhaValida = bcryptjs.compareSync(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta' });

    const token = gerarToken(usuario.id, usuario.email, usuario.role);
    res.json({
      sucesso: true,
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role
      }
    });
  });
};

// REGISTRO (opcional)
export const registrar = (req, res) => {
  const { email, nome, senha, role = 'cliente' } = req.body;

  if (!email || !nome || !senha) {
    return res.status(400).json({ erro: 'Email, nome e senha são obrigatórios' });
  }

  const senhaHash = bcryptjs.hashSync(senha, 10);

  db.run(
    'INSERT INTO usuarios (email, nome, senha, role) VALUES (?, ?, ?, ?)',
    [email, nome, senhaHash, role],
    function(err) {
      if (err) return res.status(400).json({ erro: 'Email já cadastrado' });
      
      const token = gerarToken(this.lastID, email, role);
      res.status(201).json({
        sucesso: true,
        token,
        usuario: { id: this.lastID, email, nome, role }
      });
    }
  );
};

// LISTAR USUÁRIOS (admin)
export const listarUsuarios = (req, res) => {
  db.all('SELECT id, email, nome, role, criado_em FROM usuarios', (err, usuarios) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    res.json(usuarios);
  });
};

// OBTER PERFIL
export const obterPerfil = (req, res) => {
  db.get(
    'SELECT id, email, nome, role, criado_em FROM usuarios WHERE id = ?',
    [req.usuario.id],
    (err, usuario) => {
      if (err) return res.status(500).json({ erro: 'Erro no servidor' });
      if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
      res.json(usuario);
    }
  );
};
