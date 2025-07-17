const mongoose = require('mongoose');


const saleOrderSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderUnit: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  orderRemarks: { type: String },
  orderOption: { type: String },
  orderStatus: { type: String, enum: ['pending', 'processing', 'delivered', 'cancelled', 'failed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' }
}, { timestamps: true });

saleOrderSchema.index({ saleId: 1, createdAt: -1 }); // Orders for a sale, newest first
saleOrderSchema.index({ userId: 1, createdAt: -1 }); // Orders by user, newest first
saleOrderSchema.index({ orderStatus: 1 }); // Filter by status (if you use enum)
saleOrderSchema.index({ locationId: 1 });

const SaleOrder = mongoose.model('SaleOrder', saleOrderSchema);

module.exports = {SaleOrder};
