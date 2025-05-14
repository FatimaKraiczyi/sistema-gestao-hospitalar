const requireFuncionario = (req, res, next) => {
  if (req.user?.tipo !== 'FUNCIONARIO') {
    return res.status(403).json({ error: 'Acesso restrito a funcionários' });
  }
  next();
};

module.exports = requireFuncionario;
