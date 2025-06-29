const express = require('express');
const Report = require('../models/Report');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const multer = require('multer');
const { publish } = require('../utils/queue');
const router = express.Router();

router.use(protect);

const upload = multer({ dest: 'uploads/' });

// Submit report with optional files
router.post('/', restrictTo('hacker','admin'), upload.array('files'), async (req, res) => {
  try {
    const files = req.files ? req.files.map(f => f.filename) : [];
    const report = await Report.create({ ...req.body, reporter: req.user._id, files });
    publish('reports', { id: report._id, title: report.title });
    res.json({ success: true, report });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// View reports for user
router.get('/', async (req, res) => {
  const reports = await Report.find({ reporter: req.user._id }).populate('program');
  res.json({ success: true, reports });
});

module.exports = router;
