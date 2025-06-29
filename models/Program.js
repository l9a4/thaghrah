const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  severity: { type: String, required: true },
  reward: { type: Number, required: true }
}, { _id: false });

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  rules: { type: String, required: true },
  payouts: [payoutSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Program', programSchema);
