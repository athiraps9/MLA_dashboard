const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  season: { type: String, enum: ['Season 1', 'Season 2', 'Season 3', 'Season 4'], required: true },
  mla: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  days: [{
    date: { type: Date, required: true },
    present: { type: Boolean, required: true },
    status: { type: String, enum: ['Pending', 'Verified', 'Non-Verified'], default: 'Pending' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
