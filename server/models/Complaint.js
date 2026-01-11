const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Submitted', 'In Progress', 'Resolved'], default: 'Submitted' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // PA assigned
  adminResponse: { type: String },
  paResponse: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
