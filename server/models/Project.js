const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mla: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fundsAllocated: { type: Number, required: true },
  fundsUtilized: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'in-progress', 'completed'], default: 'pending' },
  remarks: { type: String }, // Admin remarks
  beneficiaries: { type: String },
  media: [{
    type: { type: String, enum: ['image', 'video'] },
    url: { type: String }
  }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
