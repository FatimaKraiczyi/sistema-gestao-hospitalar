const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Suas rotas
app.use('/api', require('./routes/auth')); // rotas do auth-service
app.use('/api', require('./routes/paciente')); // rotas do paciente-service

// Middleware global de tratamento de erros (único e no fim, **depois** das rotas)
app.use((err, req, res, next) => {
    console.error('Erro inesperado:', err);

    // Verifica se erro veio de uma chamada axios (microserviço)
    if (err.response && err.response.data) {
        res.status(err.response.status).json(err.response.data);
        return;
    }

    // Caso erro genérico no API Gateway
    res.status(500).json({
        message: 'Erro interno no servidor'
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API Gateway rodando na porta ${PORT}`));
