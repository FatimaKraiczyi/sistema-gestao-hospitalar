const express = require('express');
const axios = require('axios');
const config = require('../config/config');

const router = express.Router();

router.get('/teste-auth', async (req, res, next) => {
  try {
    const response = await axios.get(`${config.authServiceUrl}/auth/teste`);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
