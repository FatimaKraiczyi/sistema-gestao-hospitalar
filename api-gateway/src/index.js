const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Suas rotas
app.use('/auth', require('./routes/auth')); // rotas do auth-service

// Middleware global de tratamento de erros (único e no fim, **depois** das rotas)
app.use((err, req, res, next) => {
    console.error('Erro inesperado:', err);

    // Verifica se erro veio de uma chamada axios (microserviço)
    if (err.response && err.response.data) {
        const { timestamp, status, message } = err.response.data;
        return res.status(status || 500).json({ timestamp, status, message });
    }

    // Caso erro genérico no API Gateway
    res.status(500).json({
        timestamp: new Date().toISOString(),
        status: 500,
        message: 'Erro interno no servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway rodando na porta ${PORT}`));
