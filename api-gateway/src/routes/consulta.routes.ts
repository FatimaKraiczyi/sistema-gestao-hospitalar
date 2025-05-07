import express from 'express';
const router = express.Router();

// Apenas exemplo de rota:
router.get('/', (req, res) => {
  res.json({ msg: 'Rota de consultas funcionando' });
});

export default router;
