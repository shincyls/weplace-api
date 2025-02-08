const mongoose = require('mongoose');

const paymentGatewaySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    portal: { type: String, required: true }, // IPX or IPAY or TNG
    amount: { type: Number, required: true },
    remarks: { type: String },
    reason: { type: String, enum: ['topup', 'cash'], required: true, default: 'topup' },
    ref: { type: String },
    status: { type: String, enum: ['pending', 'success', 'fail', 'error'], required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    webhookUrl: { type: String }, // URL to receive webhook updates
    webhookData: { type: mongoose.Schema.Types.Mixed } // Data received from webhook
});

// Method to handle webhook updates
paymentGatewaySchema.methods.updateStatusFromWebhook = function (webhookData) {
    this.webhookData = webhookData;
    if (webhookData.status) {
        this.status = webhookData.status;
    }
    return this.save();
};

module.exports = mongoose.model('paymentGateway', paymentGatewaySchema);
