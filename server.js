require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authController = require('./controllers/authController');

// 1) Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 2) Initialize Express app
const app = express();

// 3) Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If you use sessions/passport, initialize them here:
// const session = require('express-session');
// const passport = require('passport');
// app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// 4) Auth routes (register & login)
app.post('/auth/register', authController.register);
app.post('/auth/login',    authController.login);

// 5) Protected pages: Hacker & Company dashboards
app.get(
  '/hacker-dashboard.html',
  authController.protect,
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'hacker-dashboard.html'));
  }
);
app.get(
  '/company-dashboard.html',
  authController.protect,
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'company-dashboard.html'));
  }
);

// 6) Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 7) Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
