const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationName: { type: String, required: true},
  googleName: { type: String },
  country: { type: String, default: 'Malaysia' },
  state: { type: String },
  city: { type: String },
  poscode: { type: Number },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Location', locationSchema);

