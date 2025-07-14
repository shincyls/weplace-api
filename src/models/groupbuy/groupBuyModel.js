const mongoose = require('mongoose');

const groupBuySchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  basePrice: { type: Number, required: true },
  maxUnits: { type: Number},
  minUnits: { type: Number, required: true },
  // Upon >= tierTargetUnit has been reached, the basePrice will be adjusted to tierBasePrice
  tieredPricing: [{
    tierTargetUnit: { type: Number, required: true },
    tierBasePrice: { type: Number, required: true }
  }],
  deliveryRemarks: { type: String },
  dealStartTime: { type: Date, required: true },
  dealEndTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'active', 'collecting', 'success', 'fail', 'cancelled'], 
    default: 'scheduled' 
  },
  locationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  totalLocations: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const GroupBuy = mongoose.model('GroupBuy', groupBuySchema);

module.exports = {GroupBuy};