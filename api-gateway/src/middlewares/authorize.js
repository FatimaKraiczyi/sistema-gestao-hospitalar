function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.type)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = authorizeRoles;
