const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  description: { type: String },
  password: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  createdAt: { type: Date, default: Date.now },
  oauthProvider: { type: String },
  oauthId: { type: String },
});

module.exports = mongoose.model('User', userSchema);