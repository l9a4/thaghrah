// models/Bounty.js
const mongoose = require('mongoose');

const bountySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  reporter:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bounty', bountySchema);
