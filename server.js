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
const authController = require('./controllers/authController');
const programs = require('./routes/programs');
const reports = require('./routes/reports');
const payments = require('./routes/payments');
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

// Auth routes
app.post('/auth/register', authController.register);
app.post('/auth/login',    authController.login);
app.get ('/auth/logout',   authController.logout);

app.use('/api/programs', programs);
app.use('/api/reports', reports);
app.use('/api/payments', payments);

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
