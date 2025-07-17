const mongoose = require('mongoose');

const sellerReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  reportReason: { type: String, required: true },
  reportRemarks: { type: String },
  reportAttachments: [{ type: String }],
}, { timestamps: true });

const SellerReport = mongoose.model('SellerReport', sellerReportSchema);

module.exports = { SellerReport };
