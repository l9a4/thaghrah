module.exports = requiredRoles => {
  return (req, res, next) => {
    if (!req.user || !requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ success:false, message:'Access denied' });
    }
    next();
  };
};
