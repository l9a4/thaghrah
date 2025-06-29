const express = require('express');
const Report = require('../models/Report');
const protect = require('../middlewares/protect');
const rbac = require('../middlewares/rbac');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { publish } = require('../services/queue');
const router = express.Router();

router.use(protect);

// Submit report
router.post('/', rbac(['hacker','admin']), upload.array('files'), async (req, res) => {
  try {
    const report = await Report.create({
      title: req.body.title,
      description: req.body.description,
      program: req.body.program,
      reporter: req.user._id
    });
    await publish({ reportId: report._id, files: req.files?.map(f=>f.path) });
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
