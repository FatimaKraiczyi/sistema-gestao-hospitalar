const express = require('express');
const authRoutes = require('./auth.routes');
const pacienteRoutes = require('./paciente.routes');
const consultaRoutes = require('./consulta.routes');
const testeRoutes = require('./teste.routes');
const router = express.Router();

router.use(authRoutes);
router.use(pacienteRoutes);
router.use(consultaRoutes);
router.use(testeRoutes);

module.exports = router;
