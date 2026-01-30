const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  season: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Season', 
    required: true 
  },
  mla: { 
    type: String, 
    
    
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Present', 'Absent'], 
    required: true 
  },
  remarks: { 
    type: String,
    trim: true
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  verifiedAt: {
    type: Date
  }
}, { timestamps: true });

// Compound index to prevent duplicate attendance for same MLA on same date in same season
AttendanceSchema.index({ season: 1, mla: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
