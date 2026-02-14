const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectNumber: {
    type: String,
    required: [true, 'Project number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },

  title: { type: String, required: true },
  description: { type: String, required: true },

  category: {
    type: String,
   
  },

  constituency: {
    type: String,
    
   
  },

  fundsAllocated: { type: String, required: true },
  fundsUtilized: { type: String, default: 0 },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in-progress', 'completed'],
    default: 'pending'
  },

  remarks: { type: String },
  beneficiaries: { type: String },

  media: [
    {
      type: { type: String, enum: ['image', 'video'] },
      url: { type: String }
    }
  ],

  startDate: { type: Date },
  endDate: { type: Date },

  supportingDocument: { type: String },
  projectImage: { type: String },

  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);



