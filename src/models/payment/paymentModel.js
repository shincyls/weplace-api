const mongoose = require('mongoose');

const paymentGatewaySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    portal: { type: String, required: true }, // Payment gateway provider (e.g., Stripe, PayPal, etc.)
    transactionId: { type: String, unique: true, sparse: true }, // Unique ID from payment provider
    merchantReference: { type: String }, // Your internal reference
    amount: { type: Number, required: true },
    currency: { type: String, default: 'MYR' },
    remarks: { type: String },
    reason: { type: String, enum: ['topup', 'cash', 'purchase', 'refund', 'subscription'], required: true, default: 'topup' },
    ref: { type: String },
    status: { type: String, enum: ['pending', 'processing', 'success', 'fail', 'error', 'refunded', 'partially_refunded'], required: true, default: 'pending' },
    paymentMethod: { type: String, enum: ['credit_card', 'debit_card', 'bank_transfer', 'e_wallet', 'crypto', 'other'] },
    paymentDetails: {
        cardLast4: { type: String },
        cardBrand: { type: String },
        bankName: { type: String },
        accountLast4: { type: String },
        walletType: { type: String }
    },
    fees: { type: Number, default: 0 }, // Payment processor fees
    netAmount: { type: Number }, // Amount after fees
    metadata: { type: mongoose.Schema.Types.Mixed }, // Additional data
    webhookUrl: { type: String },
    webhookData: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    refunds: [{
        amount: { type: Number },
        reason: { type: String },
        status: { type: String, enum: ['pending', 'processed', 'failed'] },
        refundedAt: { type: Date },
        refundTransactionId: { type: String }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for better query performance
paymentGatewaySchema.index({ userId: 1, createdAt: -1 });
paymentGatewaySchema.index({ transactionId: 1 });
paymentGatewaySchema.index({ status: 1 });

// Method to handle webhook updates
paymentGatewaySchema.methods.updateStatusFromWebhook = function(webhookData) {
    this.webhookData = webhookData;
    if (webhookData.status) {
        this.status = webhookData.status;
    }
    this.updatedAt = new Date();
    return this.save();
};

// Method to process refund
paymentGatewaySchema.methods.processRefund = function(amount, reason) {
    if (this.status !== 'success') {
        throw new Error('Cannot refund a payment that is not successful');
    }
    
    const refundAmount = amount || this.amount;
    
    this.refunds.push({
        amount: refundAmount,
        reason: reason || 'Customer requested',
        status: 'pending',
        refundedAt: new Date()
    });
    
    if (refundAmount === this.amount) {
        this.status = 'refunded';
    } else {
        this.status = 'partially_refunded';
    }
    
    return this.save();
};

module.exports = mongoose.model('PaymentGateway', paymentGatewaySchema);
