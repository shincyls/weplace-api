const mongoose = require('mongoose');

// Schema
const sellerCreditBalanceSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
  amount: { type: Number, required: true },
  beforeBalance: { type: Number },
  afterBalance: { type: Number }, 
  remarks: { type: String },
  reason: { type: String }, // Reason for the transaction groupbuy, sale payment
  ref: { type: String }, // SaleId, GroupBuyId
  info: { type: String },
  type: { type: String, enum: ['topup','transfer','credit', 'debit', 'refund'], required: true },
  status: { type: String, enum: ['success', 'failed', 'error', 'pending', 'processing'], required: true, default: 'pending' },
  paymentGatewayId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentGateway' },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdBy: { type: String }, 
  taxType: { type: String, enum: ['SST', 'GST', 'N/A'], default: 'N/A' },
  taxRate: { type: Number },
  taxAmount: { type: Number }
}, { timestamps: true });

// Indexing
sellerCreditBalanceSchema.index({ sellerId: 1, createdAt: -1 });
sellerCreditBalanceSchema.index({ type: 1, status: 1 });
sellerCreditBalanceSchema.index({ ref: 1 });

// Export
const SellerCreditBalance = mongoose.model('SellerCreditBalance', sellerCreditBalanceSchema);

module.exports = SellerCreditBalance;
