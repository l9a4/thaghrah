const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

exports.register = async (req,res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password,12);
  const user = await User.create({ email, password: hash });
  createSendToken(user,201,res);
};

exports.login = async (req,res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password,user.password)) {
    return res.status(401).json({ success:false, message:'Invalid credentials' });
  }
  createSendToken(user,200,res);
};

exports.logout = (_,res) => {
  res.clearCookie('jwt').redirect('/');
};

exports.protect = async (req,res,next) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) throw 'no user';
    next();
  } catch {
    res.redirect('/'); // not authenticated → back to login
  }
};

const createSendToken = (user,status,res) => {
  const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn:'1d' });
  res.cookie('jwt',token,{ httpOnly:true, maxAge:86400000 });
  res.status(status).json({ success:true });
};

