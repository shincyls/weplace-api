const mongoose = require('mongoose');

const sellerReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  reportReason: { type: String, required: true },
  reportRemarks: { type: String },
  reportAttachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SellerReport = mongoose.model('SellerReport', sellerReportSchema);

module.exports = { SellerReport };
