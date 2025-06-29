require('dotenv').config();
const express = require('express');
const mongoose  = require('mongoose');
const path      = require('path');
const morgan    = require('morgan');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authController = require('./controllers/authController');
const programs = require('./routes/programs');
const reports = require('./routes/reports');
const payments = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const fs = require('fs');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
app.use(xss());
app.use(csrf({ cookie: true }));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/auth', limiter);

app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not defined');
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(u => done(null, u)).catch(done);
});

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_ID',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_SECRET',
  callbackURL: '/auth/google/callback'
}, async (_a,_r,profile,done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, password: profile.id });
    done(null, user);
  } catch (e) { done(e); }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || 'GITHUB_ID',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || 'GITHUB_SECRET',
  callbackURL: '/auth/github/callback'
}, async (_a,_r,profile,done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, password: profile.id });
    done(null, user);
  } catch (e) { done(e); }
}));

// Auth routes
app.post('/auth/register', authController.register);
app.post('/auth/login',    authController.login);
app.get ('/auth/logout',   authController.logout);
app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/pages/login.html' }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
    res.redirect('/pages/hacker-dashboard.html');
  });
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/pages/login.html' }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
    res.redirect('/pages/hacker-dashboard.html');
  });

app.use('/api/programs', programs);
app.use('/api/reports', reports);
app.use('/api/payments', payments);
app.use('/api/admin', adminRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Protect pages
const protected = ['courses.html','hacker-dashboard.html','company-dashboard.html'];
protected.forEach(page => {
  app.get(`/pages/${page}`, authController.protect, (_,res) =>
    res.sendFile(path.join(__dirname,'public','pages',page))
  );
});
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('Invalid CSRF token');
  }
  next(err);
});
// Fallback to index
app.get('*', (_,res) => res.sendFile(path.join(__dirname,'public','index.html')));

const PORT = process.env.PORT||3000;
app.listen(PORT, () => console.log(`🚀 Running on ${PORT}`));
