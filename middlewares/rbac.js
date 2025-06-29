module.exports = (permissions = []) => (req, res, next) => {
  const role = req.user && req.user.role;
  if (!role || !permissions.includes(role)) {
    return res.status(403).json({ success: false, message: 'غير مصرح' });
  }
  next();
};
