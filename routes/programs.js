const express = require('express');
const Program = require('../models/Program');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const router = express.Router();

router.use(protect);

// Create program (company only)
router.post('/', restrictTo('company','admin'), async (req, res) => {
  try {
    const program = await Program.create({ ...req.body, createdBy: req.user._id });
    res.json({ success: true, program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// List programs
router.get('/', async (_, res) => {
  const programs = await Program.find().sort('-_id');
  res.json({ success: true, programs });
});

module.exports = router;
