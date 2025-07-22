const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  password: { type: String },
  oauthProvider: { type: String },
  oauthId: { type: String },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  role: { type: String, enum: ['user', 'developer'], default: 'user' },
  currentCredits: { type: Number, default: 0.00, required: true },
  lastLogin: { type: Date },
  devices: [
    {
      deviceToken: { type: String, required: true },
      deviceType: { type: String, enum: ['ios', 'android'], required: true },
      appVersion: { type: String },
      deviceId: { type: String },
      lastActive: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User
