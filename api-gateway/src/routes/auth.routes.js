const express = require('express');
const requestAuthService = require('../services/authService');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.use('/login', async (req, res, next) => {
  try {
    const response = await requestAuthService(req.method, req.url, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

router.use('/cadastrar', authenticateToken, async (req, res, next) => {
  try {
    const response = await requestAuthService(req.method, req.url, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
