const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const pacienteRoutes = require('./routes/paciente');
const consultaRoutes = require('./routes/consulta');

app.use('/api', authRoutes);
app.use('/api', pacienteRoutes);
app.use('/api', consultaRoutes);

app.use((err, req, res, next) => {
    console.error('Erro inesperado:', err.message);
    if (err.response && err.response.data) {
        res.status(err.response.status).json(err.response.data);
        return;
    }
    res.status(500).json({ message: 'Erro interno no servidor' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway rodando na porta ${PORT}`);
    
    console.log('--- ROTAS REGISTRADAS NO API GATEWAY ---');
    const listEndpoints = (router, basePath) => {
        router.stack.forEach((layer) => {
            if (layer.route) {
                const path = basePath + layer.route.path;
                const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
                console.log(`[ROTA]: ${methods} ${path}`);
            } else if (layer.name === 'router') {
                const newBasePath = basePath + layer.regexp.source.replace('\\/?(?=\\/|$)', '').replace('^\\', '');
                listEndpoints(layer.handle, newBasePath);
            }
        });
    };
    listEndpoints(app._router, '');
    console.log('--------------------------------------');
});