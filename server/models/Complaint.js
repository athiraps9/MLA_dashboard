const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Submitted', 'In Review', 'Resolved'], default: 'Submitted' },
  adminResponse: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
