const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['public', 'authority'], default: 'public' },
  role: { type: String, enum: ['admin', 'mla', 'pa', 'public'], required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  constituency: { type: String },
  address: { type: String },
  assemblyNumber: { type: String },
  officeAddress: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  education: [{
    qualification: { type: String },
    institution: { type: String },
    passingYear: { type: String }
  }],
  district: { type: String }, // For MLA
  avatar: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
