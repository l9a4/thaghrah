const express = require('express');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const router = express.Router();

router.use(protect);

// Placeholder for Stripe integration
router.post('/create', restrictTo('company','admin'), async (_, res) => {
  res.json({ success: true, message: 'payment intent placeholder' });
});

module.exports = router;
