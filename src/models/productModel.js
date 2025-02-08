const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productName: { type: String, required: true, unique: true },
  productDesc: { type: String, required: true, unique: true },
  productImages: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  productOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductOrder' }],
  productUserReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductUserReview' }]
});

const productOrderSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  normalUnitPrice: { type: Number, required: true },
  maxAllowedUnits: { type: Number, required: true },
  enablePriceTiers: { type: Boolean, default: false },
  priceTiers: [{
    targetUnit: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['collecting', 'success', 'fail'], default: 'collecting' },
  locationId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true }],
  totalLocations: { type: Number, required: true, default: 1 }, // Depends on how many location seller selected
  totalCredits: { type: Number, required: true, default: 0 }, // Depends on how many location seller selected
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  productOrderUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductOrderUser' }]
});

const productOrderUserSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductOrder', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderUnit: { type: Number, required: true },
  orderRemarks: { type: String },
  orderOption: { type: String },
  orderStatus: { type: Boolean, default: true },
  paymentStatus: { type: Boolean, default: false },
  paymentInfo: { type: String },
  paymentType: { type: String },
  creditBalanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditBalance' },
});

const productUserReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductOrder', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true, default: 5 },
  review: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
module.exports = mongoose.model('ProductOrder', productOrderSchema);
module.exports = mongoose.model('ProductOrderUser', productOrderUserSchema);
module.exports = mongoose.model('ProductUserReview', productUserReviewSchema);