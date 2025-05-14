const express = require('express');
const requestConsultaService = require('../services/consultaService');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.use('/consulta', authenticateToken, async (req, res, next) => {
  try {
    const headers = { 'user-id': req.user.id, 'user-tipo': req.user.tipo };
    const response = await requestConsultaService(req.method, req.url, req.body, headers);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
