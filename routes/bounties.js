// routes/bounties.js
const express = require('express');
const Bounty  = require('../models/Bounty');
const router  = express.Router();

router.post('/', async (req, res) => {
  try {
    const bounty = await Bounty.create({
      title: req.body.title,
      description: req.body.description,
      reporter: req.user._id
    });
    res.json({ success: true, bounty });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  const list = await Bounty.find({ reporter: req.user._id }).sort('-createdAt');
  res.json({ success: true, list });
});

module.exports = router;
