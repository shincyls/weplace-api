const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  password: { type: String },
  position: { type: String },
  department: { type: String },
  role: { type: String, enum: ['user', 'developer'], default: 'user' },
  currentCredits: { type: Number, default: 0.00, required: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin
