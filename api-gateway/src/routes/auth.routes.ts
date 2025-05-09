import express from 'express'
import axios from 'axios'

const router = express.Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna um token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticado com sucesso.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(
      'http://authservice:8080/auth/login',
      req.body
    )
    res.status(response.status).json(response.data)
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Erro interno no login'
    })
  }
})

export default router
