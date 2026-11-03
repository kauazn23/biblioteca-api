import express from 'express'
import livrosRoutes from './routes/livrosroutes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API da biblioteca escolar' });
});

app.use('/livros', livrosRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

export default app;