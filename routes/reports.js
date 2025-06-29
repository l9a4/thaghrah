const express = require('express');
const Report = require('../models/Report');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const router = express.Router();

router.use(protect);

// Submit report
router.post('/', restrictTo('hacker','admin'), async (req, res) => {
  try {
    const report = await Report.create({ ...req.body, reporter: req.user._id });
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
