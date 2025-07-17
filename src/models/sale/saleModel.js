const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sellingPrice: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number },
  businessHour: [
    {
      day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      time: { type: String }, // eg: 0-10,12-20, display to user, to be handle on frontend side
    }
  ],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  saleOrderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleOrder' }],
  locationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
}, { timestamps: true });

saleSchema.index({ sellerId: 1, startTime: -1 });
saleSchema.index({ productId: 1 });
saleSchema.index({ isActive: 1 });
saleSchema.index({ startTime: 1, endTime: 1 });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = {Sale};