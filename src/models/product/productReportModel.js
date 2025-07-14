const mongoose = require('mongoose');

const productReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  reportReason: { type: String, required: true },
  reportRemarks: { type: String },
  reportAttachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProductReport = mongoose.model('ProductReport', productReportSchema);

module.exports = { ProductReport };
