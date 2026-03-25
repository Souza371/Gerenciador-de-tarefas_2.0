import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import './database.js';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API Gerenciador de Tarefas 2.0 rodando!' });
});

// Rotas
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📝 API documentação: http://localhost:${PORT}/api/health\n`);
});
