// middlewares/protect.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new Error('Not authenticated');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};
