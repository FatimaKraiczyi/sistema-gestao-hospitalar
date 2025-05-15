const express = require('express');
const axios = require('axios');
const config = require('../config/config');

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const response = await axios.post(`${config.authServiceUrl}/auth/login`, req.body);	
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

router.post("/cadastrar", async (req, res, next) => {
  try {
    const response = await axios.post(`${config.authServiceUrl}/auth/cadastro`, req.body);	
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
