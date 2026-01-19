const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  description: { 
    type: String,
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Validation: endDate must be after startDate
SeasonSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

module.exports = mongoose.model('Season', SeasonSchema);
