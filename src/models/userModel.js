const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
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
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', userSchema);

