const requirePaciente = (req, res, next) => {
  if (req.user?.tipo !== 'PACIENTE') {
    return res.status(403).json({ error: 'Acesso restrito a pacientes' });
  }
  next();
};

module.exports = requirePaciente;
