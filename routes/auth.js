// routes/auth.js
const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const token = signToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7*24*3600*1000 });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('Email and password required');
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      throw new Error('Invalid credentials');
    const token = signToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7*24*3600*1000 });
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

router.get('/logout', (_req, res) => {
  res.clearCookie('jwt').json({ success: true });
});

module.exports = router;
