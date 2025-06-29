// server.js

// 1) تحميل متغيّرات البيئة
require('dotenv').config();

// 2) استيراد الحزم
const express       = require('express');
const mongoose      = require('mongoose');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const morgan        = require('morgan');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');

// 3) استيراد الروترات والوسيط
const authRouter    = require('./routes/auth');
const bountyRouter  = require('./routes/bounties');
const protect       = require('./middlewares/protect');

// 4) تهيئة التطبيق
const app = express();

// 5) Middleware أساسية
app.use(helmet());                                   // رؤوس الأمان
app.use(morgan('dev'));                              // تسجيل طلبات HTTP
app.use(rateLimit({                                  // تحديد عدد الطلبات
  windowMs: 1 * 60 * 1000,  // 1 دقيقة
  max: 60,                 // 60 طلب لكل IP
  message: 'Too many requests, please try again later.'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 6) الاتصال بقاعدة MongoDB
if (!process.env.MONGO_URI) {
  console.error('❌ Error: MONGO_URI is not defined in .env');
  process.exit(1);
}
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ========== مسارات المصادقة ==========
app.use('/auth', authRouter);

// ========== مسارات الـ API المحمية ==========
app.use('/api/bounties', protect, bountyRouter);

// ========== تقديم الملفات الثابتة ==========
app.use(express.static(path.join(__dirname, 'public')));

// ========== صفحات محمية ==========
const protectedPages = [
  'courses.html',
  'hacker-dashboard.html',
  'company-dashboard.html'
];
protectedPages.forEach(page => {
  app.get(`/pages/${page}`, protect, (_req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'pages', page))
  );
});

// ========== catch-all لإعادة index.html لكل طلب غير مصرح به ==========
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== معالج أخطاء عامّة ==========
app.use((err, _req, res, _next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ========== تشغيل السيرفر ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
