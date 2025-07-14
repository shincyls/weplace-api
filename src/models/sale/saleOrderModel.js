const mongoose = require('mongoose');

const saleOrderSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderUnit: { type: Number, required: true },
  orderRemarks: { type: String },
  orderOption: { type: String },
  orderStatus: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SaleOrder = mongoose.model('SaleOrder', saleOrderSchema);

module.exports = {SaleOrder};
