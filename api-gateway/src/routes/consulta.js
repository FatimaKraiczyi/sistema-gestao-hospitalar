const express = require('express');
const axios = require('axios');
const router = express.Router();

const CONSULTA_SERVICE_URL = process.env.CONSULTA_MS_URL;

const authenticateToken = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorize');

router.get('/agendamentos/paciente', authenticateToken, authorizeRoles('PACIENTE'), async (req, res, next) => {
  try {
    const { id: pacienteId } = req.user; // Pega o ID do paciente logado a partir do token
    
    const response = await axios.get(`${CONSULTA_SERVICE_URL}/agendamentos/paciente/${pacienteId}`);
    
    res.status(response.status).json(response.data);
  } catch (err) {
    next(err);
  }
});

router.post('/agendamentos', authenticateToken, authorizeRoles('PACIENTE'), async (req, res, next) => {
    try {
        const response = await axios.post(`${CONSULTA_SERVICE_URL}/agendamentos`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

router.patch('/agendamentos/:id/status', authenticateToken, authorizeRoles('PACIENTE'), async (req, res, next) => {
     try {
        const { id } = req.params;
        const { status } = req.query;
        const response = await axios.patch(`${CONSULTA_SERVICE_URL}/agendamentos/${id}/status?status=${status}`);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

router.get('/consultas', authenticateToken, async (req, res, next) => {
    try {
        const response = await axios.get(`${CONSULTA_SERVICE_URL}/consultas`, { params: req.query });
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

router.get('/especialidades', authenticateToken, async (req, res, next) => {
    try {
        const response = await axios.get(`${CONSULTA_SERVICE_URL}/especialidades`);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

router.get('/medicos', authenticateToken, async (req, res, next) => {
    try {
        const response = await axios.get(`${CONSULTA_SERVICE_URL}/medicos`, { params: req.query });
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

router.post('/consultas', authenticateToken, authorizeRoles('FUNCIONARIO'), async (req, res, next) => {
    try {
        const response = await axios.post(`${CONSULTA_SERVICE_URL}/consultas`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;