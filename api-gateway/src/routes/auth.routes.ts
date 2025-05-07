import express from 'express';
import proxyService from '../services/proxy.service';
const router = express.Router();

const AUTH_MS_URL = process.env.AUTH_MS_URL || 'http://localhost:8081';

router.post('/login', proxyService(`${AUTH_MS_URL}/auth/login`));
router.post('/register', proxyService(`${AUTH_MS_URL}/auth/register`));

export default router;
