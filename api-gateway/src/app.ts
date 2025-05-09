import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import pacienteRoutes from './routes/pacientes.routes';
import consultaRoutes from './routes/consultas.routes';
import { setupSwagger } from './swagger';

dotenv.config();
const app = express();
setupSwagger(app);
app.use(cors());
app.use(express.json());


// Rotas
app.use('/auth', authRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/consultas', consultaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
