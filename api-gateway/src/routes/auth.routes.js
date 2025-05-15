const express = require('express');
const requestAuthService = require('../services/authService');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const response = await requestAuthService('post', '/login', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

router.post('/cadastrar', async (req, res, next) => {
  try {
    const response = await requestAuthService('post', '/cadastro', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;