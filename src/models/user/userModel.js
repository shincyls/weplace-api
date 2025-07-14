const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  oauthProvider: { type: String },
  oauthId: { type: String },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }
});

const User = mongoose.model('User', userSchema);

module.exports = User
