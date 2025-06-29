require('dotenv').config();
const express = require('express');
const mongoose  = require('mongoose');
const path      = require('path');
const cookieParser = require('cookie-parser');
const authController = require('./controllers/authController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Protect pages
const protected = ['courses.html','hacker-dashboard.html','company-dashboard.html'];
protected.forEach(page => {
  app.get(`/pages/${page}`, authController.protect, (_,res) =>
    res.sendFile(path.join(__dirname,'public','pages',page))
  );
});
// Fallback to index
app.get('*', (_,res) => res.sendFile(path.join(__dirname,'public','index.html')));

const PORT = process.env.PORT||3000;
app.listen(PORT, () => console.log(`🚀 Running on ${PORT}`));
