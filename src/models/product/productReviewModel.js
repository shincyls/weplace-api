const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, required: true },
}, { timestamps: true });

const ProductReview = mongoose.model('ProductReview', productReviewSchema);

module.exports = { ProductReview };