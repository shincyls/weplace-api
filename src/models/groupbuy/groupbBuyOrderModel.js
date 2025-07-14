const mongoose = require('mongoose');

const groupBuyOrderSchema = new mongoose.Schema({
  groupBuyId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupBuy', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderUnit: { type: Number, required: true },
  orderRemarks: { type: String },
  orderOption: { type: String },
  orderStatus: { 
    type: String, 
    enum: ['processing', 'delivered', 'cancelled', 'failed'],
    default: 'processing' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid'],
    default: 'unpaid' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const GroupBuyOrder = mongoose.model('GroupBuyOrder', groupBuyOrderSchema);

module.exports = {GroupBuyOrder};
