import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const gerarToken = (usuarioId, email, role) => {
  return jwt.sign(
    { id: usuarioId, email, role },
    SECRET,
    { expiresIn: '7d' }
  );
};

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

export const verificarRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
  };
};
