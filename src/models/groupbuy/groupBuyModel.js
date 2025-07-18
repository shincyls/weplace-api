const mongoose = require('mongoose');

const groupBuySchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  basePrice: { type: Number, required: true },
  category: { type: String, enums: ['foods', 'goods', 'services', 'other'], required: true },
  tags: { type: [String] },
  maxUnits: { type: Number }, // Optional, if not set, no limit
  mustMinTier : { type: Boolean, default: false }, // If true, must reach minTier to start groupbuy
  tierPricing: [{
    tierUnit: { type: Number, required: true },
    tierPrice: { type: Number, required: true }
  }],
  deliveryRemarks: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String,
    enum: ['on-going', 'success', 'fail', 'cancelled'], 
    default: 'on-going' 
  },
  groupbuyOrderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupBuyOrder' }],
  locationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  sellerCreditBalanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerCreditBalance' }
}, { timestamps: true });

groupBuySchema.index({ sellerId: 1, startTime: -1 });
groupBuySchema.index({ productId: 1 });
groupBuySchema.index({ status: 1 });
groupBuySchema.index({ startTime: 1, endTime: 1 });

const GroupBuy = mongoose.model('GroupBuy', groupBuySchema);

module.exports = {GroupBuy};