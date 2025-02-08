const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sellerName: { type: String, required: true, unique: true },
  sellerEmail: { type: String, required: true, unique: true },
  sellerType: { type: String, enum: ['personal', 'company', 'coorporate'], default: 'personal', required: true },
  companyPhone: { type: String, required: true },
  companyName: { type: String },
  companyRegNo: { type: String },
  companyAddress: { type: String},
  companyAddressCountry: { type: String, default: 'Malaysia' },
  companyAddressState: { type: String },
  companyAddressCity: { type: String },
  companyAddressPoscode: { type: String },
  bankName: { type: String },
  bankAccount: { type: String },
  approval: { type: Boolean, default: false },
  approvalImages: [{ type: String }],
  approvalBy: { type: String, default: 'weplace' },
  approvalDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seller', sellerSchema);

