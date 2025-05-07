import express from 'express';
const router = express.Router();

// Apenas exemplo de rota:
router.get('/', (req, res) => {
  res.json({ msg: 'Rota de pacientes funcionando' });
});

export default router;
