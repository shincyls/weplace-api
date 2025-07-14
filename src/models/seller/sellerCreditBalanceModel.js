const mongoose = require('mongoose');

// Schema
const sellerCreditBalanceSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
  amount: { type: Number, required: true },
  beforeBalance: { type: Number },
  afterBalance: { type: Number }, 
  remarks: { type: String },
  info: { type: String },
  ref: { type: String },
  type: { type: String, enum: ['topup','transfer','credit', 'debit', 'refund'], required: true },
  status: { type: String, enum: ['success', 'failed', 'error', 'pending', 'processing'], required: true, default: 'pending' },
  paymentGatewayId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentGateway' },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdBy: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexing
sellerCreditBalanceSchema.index({ sellerId: 1, createdAt: -1 });
sellerCreditBalanceSchema.index({ type: 1, status: 1 });
sellerCreditBalanceSchema.index({ ref: 1 });

// Export
const SellerCreditBalance = mongoose.model('SellerCreditBalance', sellerCreditBalanceSchema);

module.exports = SellerCreditBalance;
