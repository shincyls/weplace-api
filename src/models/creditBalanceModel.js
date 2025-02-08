const mongoose = require('mongoose');

const creditBalanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['topup', 'transfer', 'refund', 'onhold', 'purchase', 'reward', 'product_order'], required: true },
    amount: { type: Number, required: true },
    remarks: { type: String },
    info: { type: String },
    ref: { type: String },
    status: { type: String, enum: ['success', 'failed', 'error', 'pending'], required: true, default: 'pending' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CreditBalance', creditBalanceSchema);