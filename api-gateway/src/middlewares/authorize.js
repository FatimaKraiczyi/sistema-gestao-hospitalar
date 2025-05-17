// Middleware para liberar acesso só para usuários de um tipo específico
module.exports = function authorizeRoles(...allowedTypes) {
  return (req, res, next) => {
    if (!req.user || !allowedTypes.includes(req.user.tipo)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
};

module.exports = authorizeRoles;