const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true }, // Verified: Email is key for public users
  password: { type: String, required: true },
  userType: { type: String, enum: ['public', 'authority'], default: 'public' }, // New field
  role: { type: String, enum: ['admin', 'mla', 'pa', 'public'], required: true },
  district: { type: String }, // Only for MLA
  fullName: { type: String, required: true },
  avatar: { type: String }, // URL to profile photo
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Track who created PA accounts
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
