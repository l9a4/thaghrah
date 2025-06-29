// controllers/authController.js

const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const User      = require('../models/User');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.create({ email, password, role });
    const token = signToken(user._id);
    res
      .cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ success: true, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('أدخل بريدًا وكلمة المرور');
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      throw new Error('بيانات غير صحيحة');
    const token = signToken(user._id);
    res
      .cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ success: true });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('jwt').json({ success: true });
};

exports.protect = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new Error('غير مصادق');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};
