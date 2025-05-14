const express = require('express');
const requestAuthService = require('../services/authService');
const authenticateToken = require('../middlewares/authenticateToken');
const requireFuncionario = require('../middlewares/requireFuncionario');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */

router.post('/auth/login', loginHandler);

router.use('/auth', async (req, res, next) => {
  try {
    const response = await requestAuthService(req.method, req.url, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

router.use('/cadastro/funcionario', authenticateToken, requireFuncionario, async (req, res, next) => {
  try {
    const response = await requestAuthService(req.method, req.url, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
