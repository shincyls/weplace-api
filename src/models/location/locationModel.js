const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationName: { type: String, required: true, trim: true },
  googleName: { type: String, trim: true },
  googlePlaceId: { type: String },
  formattedAddress: { type: String, trim: true },
  addressComponents: {
    streetNumber: { type: String },
    street: { type: String },
    district: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'Malaysia' },
    poscode: { type: String }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude] - GeoJSON format
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates: longitude must be between -180 and 180, latitude between -90 and 90'
      }
    }
  },
  latitude: { 
    type: Number, 
    required: true,
    min: -90,
    max: 90
  },
  longitude: { 
    type: Number, 
    required: true,
    min: -180,
    max: 180
  },
  locationType: { 
    type: String,
    enum: ['residential', 'office', 'commercial', 'industrial', 'public', 'other'],
    default: 'other'
  },
  isActive: { type: Boolean, default: true },
  metadata: { type: mongoose.Schema.Types.Mixed }, // For additional data
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

locationSchema.pre('save', function(next) {
  if (this.isModified('latitude') || this.isModified('longitude')) {
    this.location.coordinates = [this.longitude, this.latitude];
  } else if (this.isModified('location.coordinates')) {
    this.longitude = this.location.coordinates[0];
    this.latitude = this.location.coordinates[1];
  }
  next();
});

locationSchema.index({ location: '2dsphere' });
locationSchema.index({ locationName: 'text', 'addressComponents.city': 'text' });
locationSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Location', locationSchema);

