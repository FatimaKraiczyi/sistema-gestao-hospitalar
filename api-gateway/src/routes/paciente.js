const express = require('express');
const axios = require('axios');
const router = express.Router();

const PACIENTE_SERVICE_URL = process.env.PACIENTE_MS_URL;

const authenticateToken = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorize');

router.post('/paciente/cadastro', authenticateToken, authorizeRoles('PACIENTE'), async (req, res, next) => {
  try {
    const { id: userId, cpf, email } = req.user; // id = UUID vindo do token JWT

    // Junte os dados do body com o id, cpf e email do token
    const payload = {
      id: userId,
      cpf,
      email,
      ...req.body,
    };

    const response = await axios.post(`${PACIENTE_SERVICE_URL}/paciente`, payload, {
      headers: { Authorization: req.headers.authorization }, // encaminha token
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    next(err);
  }
});

router.get('/paciente/cep/:cep', async (req, res, next) => {
    try {
        const { cep } = req.params;
        const response = await axios.get(`${PACIENTE_SERVICE_URL}/paciente/cep/${cep}`);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

router.get('/paciente', authenticateToken, authorizeRoles('PACIENTE'), async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const response = await axios.get(`${PACIENTE_SERVICE_URL}/paciente/${userId}`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
