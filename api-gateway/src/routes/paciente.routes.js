const express = require('express');
const requestPacienteService = require('../services/pacienteService');
const authenticateToken = require('../middlewares/authenticateToken');
const requirePaciente = require('../middlewares/requirePaciente');

const router = express.Router();

router.use('/paciente', authenticateToken, requirePaciente, async (req, res, next) => {
  try {
    const headers = { 'user-id': req.user.id };
    const response = await requestPacienteService(req.method, req.url, req.body, headers);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
