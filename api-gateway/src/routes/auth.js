const express = require('express');
const axios = require('axios');
const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_MS_URL;

router.post('/login', async (req, res, next) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
        res.json(response.data);
    } catch (err) {
        next(err);
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
        res.json(response.data);
    } catch (err) {
        next(err);
    }
});

router.get('/teste-auth', async (req, res, next) => {
	try {
		const response = await axios.get(`${AUTH_SERVICE_URL}/auth/teste`);
		res.json(response.data);
	} catch (error) {
		next(error);
	}
});

module.exports = router;