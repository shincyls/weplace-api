const mongoose = require('mongoose');

// To store the seller information
const sellerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sellerName: { type: String, required: true, unique: true },
  sellerEmail: { type: String, required: true, unique: true },
  sellerType: { type: String, enum: ['personal', 'company', 'coorporate'], default: 'personal', required: true },
  companyPhone: { type: String, required: true },
  companyName: { type: String },
  companyRegNo: { type: String },
  companyAddressLine1: { type: String},
  companyAddressLine2: { type: String},
  companyAddressLine3: { type: String},
  companyAddressCity: { type: String },
  companyAddressState: { type: String },
  companyAddressPoscode: { type: String },
  companyAddressCountry: { type: String, default: 'Malaysia' },
  bankName: { type: String },
  bankAccount: { type: String },
  attachments: [{ type: String }],
  approvalStatus: { type: Boolean, default: false },
  approvalBy: { type: String, default: 'admin' },
  approvalDate: { type: Date },
  currentCredits: { type: Number, default: 0.00, required: true },
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = { Seller };
