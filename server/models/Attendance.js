const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  mla: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['presentation', 'question', 'committee', 'other'], required: true },
  description: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  remarks: { type: String }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
