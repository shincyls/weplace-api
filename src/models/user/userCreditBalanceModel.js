const mongoose = require('mongoose');

// Schema
const userCreditBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  beforeBalance: { type: Number },
  afterBalance: { type: Number }, 
  paymentGatewayId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentGateway' },
  remarks: { type: String },
  info: { type: String },
  ref: { type: String },
  type: { type: String, enum: ['topup','transfer','credit', 'debit', 'refund', 'reversal'], required: true },
  status: { type: String, enum: ['success', 'failed', 'error', 'pending', 'processing'], required: true, default: 'pending' },
  metadata: { type: mongoose.Schema.Types.Mixed }, // Additional data
  ipAddress: { type: String },
  createdBy: { type: String }, // User or system that created the transaction
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexing
userCreditBalanceSchema.index({ sellerId: 1, createdAt: -1 });
userCreditBalanceSchema.index({ type: 1, status: 1 });
userCreditBalanceSchema.index({ ref: 1 });

// Export
const SellerCreditBalance = mongoose.model('UserCreditBalance', userCreditBalanceSchema);

module.exports = SellerCreditBalance;
