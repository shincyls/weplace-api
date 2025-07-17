const mongoose = require('mongoose');

const groupBuyOrderSchema = new mongoose.Schema({
  groupBuyId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupBuy', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderUnit: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // Total price for the order, including fees and discounts.
  orderRemarks: { type: String },
  orderOption: { type: String },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'delivered', 'cancelled', 'failed'], // 'pending' is for new orders, 'processing' is for orders that are being processed, 'delivered' is for orders that have been delivered, 'cancelled' is for orders that have been cancelled, and 'failed' is for orders that have failed.
    default: 'pending' // Default value is 'pending' for new orders.
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid'],
    default: 'unpaid' 
  }
}, { timestamps: true });

groupBuyOrderSchema.index({ groupBuyId: 1, userId: 1 });
groupBuyOrderSchema.index({ userId: 1, orderStatus: 1 });
groupBuyOrderSchema.index({ paymentStatus: 1 });
groupBuyOrderSchema.index({ locationId: 1 });
groupBuyOrderSchema.index({ groupBuyId: 1, locationId: 1 });

const GroupBuyOrder = mongoose.model('GroupBuyOrder', groupBuyOrderSchema);

module.exports = {GroupBuyOrder};
