function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.type)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }

    next();
  };
}

module.exports = authorizeRoles;
