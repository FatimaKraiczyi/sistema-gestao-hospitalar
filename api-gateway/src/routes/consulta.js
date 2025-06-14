const express = require('express');
const axios = require('axios');
const router = express.Router();

const CONSULTA_SERVICE_URL = process.env.CONSULTA_MS_URL;

const authenticateToken = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorize');

// helper para encaminhar as requisições
const proxyRequest = (method) => async (req, res, next) => {
    try {
        const url = `${CONSULTA_SERVICE_URL}${req.path}`;
        const { data, status } = await axios({
            method,
            url,
            data: req.body,
            params: req.query,
            headers: {
                ...(req.headers.authorization && { Authorization: req.headers.authorization })
            }
        });
        res.status(status).json(data);
    } catch (err) {
        next(err);
    }
};

// rotas públicas para paciente e funcionário
router.get('/especialidades', authenticateToken, proxyRequest('get'));
router.get('/medicos', authenticateToken, proxyRequest('get'));
router.get('/consultas', authenticateToken, proxyRequest('get'));
router.get('/agendamentos', authenticateToken, (req, res, next) => {
    // filtra o agendamento do paciente pelo id
    if (req.user.tipo === 'PACIENTE') {
        req.query.paciente = req.user.id;
    }
    proxyRequest('get')(req, res, next);
});

// rotas só do paciente
router.post('/agendamentos', authenticateToken, authorizeRoles('PACIENTE'), proxyRequest('post'));
router.patch('/agendamentos/:id/status', authenticateToken, authorizeRoles('PACIENTE', 'FUNCIONARIO'), proxyRequest('patch'));

// rotas só do funcionário
router.post('/consultas', authenticateToken, authorizeRoles('FUNCIONARIO'), proxyRequest('post'));
router.put('/consultas/:codigo', authenticateToken, authorizeRoles('FUNCIONARIO'), proxyRequest('put'));
router.patch('/consultas/:codigo/status', authenticateToken, authorizeRoles('FUNCIONARIO'), proxyRequest('patch'));
router.delete('/consultas/:codigo', authenticateToken, authorizeRoles('FUNCIONARIO'), proxyRequest('delete'));

module.exports = router;