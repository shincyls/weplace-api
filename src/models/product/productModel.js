const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productName: { type: String, required: true, unique: true },
  productDesc: { type: String, required: true },
  productCategory: { type: String },
  productAttachments: [{ type: String }],
  productTags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

productSchema.index({ sellerId: 1, createdAt: -1 });
productSchema.index({ productName: 'text', productDesc: 'text' });
productSchema.index({ productCategory: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = {Product};
