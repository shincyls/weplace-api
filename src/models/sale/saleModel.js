const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  basePrice: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, default: 0 },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = {Sale};