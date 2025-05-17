const express = require('express');
const axios = require('axios');
const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_MS_URL;

// Login
router.post('/login', async (req, res, next) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

// Registro
router.post('/register', async (req, res, next) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

// Esqueci a senha
router.post('/forgot-password', async (req, res, next) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/auth/forgot-password`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

// Esqueci o e-mail
router.post('/forgot-email', async (req, res, next) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/auth/forgot-email`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

// Health check
router.get('/teste', async (req, res, next) => {
    try {
        const response = await axios.get(`${AUTH_SERVICE_URL}/auth/teste`);
        res.status(response.status).json(response.data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;