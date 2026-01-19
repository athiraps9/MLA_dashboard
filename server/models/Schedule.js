const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  venue: { 
    type: String, 
    required: true,
    trim: true
  },
  scheduleType: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Cancelled'], 
    default: 'Pending' 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  approvedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);
