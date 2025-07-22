const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  category: { type: String, enums: ['foods', 'goods', 'services', 'other'], required: true },
  tags: { type: [String] },
  sellingPrice: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number },
  businessHour: { 
    1: { type: String, default: '0-24' },
    2: { type: String, default: '0-24' },
    3: { type: String, default: '0-24' },
    4: { type: String, default: '0-24' },
    5: { type: String, default: '0-24' },
    6: { type: String, default: '0-24' },
    7: { type: String, default: '0-24' }
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  saleOrderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleOrder' }],
  locationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  sellerCreditBalanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerCreditBalance' },
}, { timestamps: true });

saleSchema.index({ sellerId: 1, startTime: -1 });
saleSchema.index({ productId: 1 });
saleSchema.index({ isActive: 1 });
saleSchema.index({ startTime: 1, endTime: 1 });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = {Sale};