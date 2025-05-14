const express = require('express');
const authRoutes = require('./auth.routes');
const pacienteRoutes = require('./paciente.routes');
const consultaRoutes = require('./consulta.routes');

const router = express.Router();

router.use(authRoutes);
router.use(pacienteRoutes);
router.use(consultaRoutes);

module.exports = router;
