const express = require('express');
const rbac = require('../middlewares/rbac');
const router = express.Router();

router.get('/ping', rbac(['admin']), (req, res) => {
  res.json({ success: true, message: 'pong' });
});

module.exports = router;
