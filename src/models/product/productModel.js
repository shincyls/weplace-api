const mongoose = require('mongoose');
require('../sale/saleModel');
require('../groupbuy/groupBuyModel');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productName: { type: String, required: true },
  productDesc: { type: String, required: true },
  productCategory: { type: String },
  productAttachments: [{ type: String }],
  productTags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  saleIds : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }],
  groupbyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupBuy' }],
}, { timestamps: true });

productSchema.index({ sellerId: 1, createdAt: -1 });
productSchema.index({ productName: 'text', productDesc: 'text' });
productSchema.index({ productCategory: 1, isActive: 1 });
productSchema.index({ saleIds: 1 });
productSchema.index({ groupbyIds: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = {Product};
