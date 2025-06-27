// حماية Dashboard الباحثين
app.get('/hacker-dashboard.html', authController.protect, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hacker-dashboard.html'));
});

// حماية Dashboard الشركات
app.get('/company-dashboard.html', authController.protect, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'company-dashboard.html'));
});

const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const bodyParser = require('body-parser');

const authController = require('./controllers/authController');

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/thaghrah', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Security middleware
app.use(helmet());
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());
app.use(cors());
app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(bodyParser.json());

// Authentication routes
app.post('/auth/register', authController.register);
app.post('/auth/login',    authController.login);
app.get('/auth/logout',    authController.logout);

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Sample data APIs
const programs = [
  { name: 'شركة XYZ', reward: '$100–$5,000' },
  { name: 'شركة ABC', reward: '$200–$10,000' }
];
const courses = [
  { title: 'Penetration Testing for Beginners', price: '300 جنيه' }
];
app.get('/api/programs', (_req, res) => res.json(programs));
app.get('/api/courses',  (_req, res) => res.json(courses));

// Report model and endpoints
const Report = mongoose.model('Report', new mongoose.Schema({
  title: String, description: String, type: String, createdAt: { type: Date, default: Date.now }
}));
app.get('/api/reports', async (_req, res) => {
  const reports = await Report.find().sort('-createdAt');
  res.json(reports);
});
app.post('/api/reports', async (req, res) => {
  const { title, description, type } = req.body;
  await new Report({ title, description, type }).save();
  io.emit('new-report', { title, type });
  res.json({ success: true });
});
app.post('/api/pay', (_req, res) => res.json({ success: true }));
app.post('/api/withdraw', (_req, res) => res.json({ success: true }));
app.get('/api/hacker/activity', (_req, res) => res.json({ logs: [] }));

io.on('connection', socket => {
  console.log('User connected');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/api/check-auth', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ loggedIn: true, role: decoded.role });
  } catch(err) {
    res.json({ loggedIn: false });
  }
});app.get('/api/hacker/activity', authController.protect, async (req, res) => {
  const reports = await Report.find({ user: req.user.id });
  res.json({ reports });
});const Program = mongoose.model('Program', new mongoose.Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  name: String,
  reward: String
}));

app.get('/api/company/programs', authController.protect, async (req, res) => {
  const programs = await Program.find({ owner: req.user.id });
  res.json({ programs });
});





