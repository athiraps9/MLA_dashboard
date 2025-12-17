const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mla: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fundsAllocated: { type: Number, required: true },
  fundsUtilized: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remarks: { type: String }, // Admin remarks
  beneficiaries: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
