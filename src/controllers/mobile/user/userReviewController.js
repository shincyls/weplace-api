// For User To Review a Product or Seller

const ProductReview = require('../models/product/productReviewModel');
const SellerReview = require('../models/seller/sellerReviewModel');

// Create a new product review
exports.createProductReview = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.rating = req.body.rating;
    data.review = req.body.review;

    const newProductReview = new ProductReview(data);
    const savedProductReview = await newProductReview.save();
    res.status(201).json(savedProductReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product review
exports.updateProductReview = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.rating = req.body.rating;
    data.review = req.body.review;

    const updatedProductReview = await ProductReview.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updatedProductReview) {
      return res.status(404).json({ message: 'Product review not found' });
    }
    res.status(200).json(updatedProductReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new seller review
exports.createSellerReview = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.rating = req.body.rating;
    data.review = req.body.review;

    const newSellerReview = new SellerReview(data);
    const savedSellerReview = await newSellerReview.save();
    res.status(201).json(savedSellerReview);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a seller review
exports.updateSellerReview = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.rating = req.body.rating;
    data.review = req.body.review;

    const updatedSellerReview = await SellerReview.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updatedSellerReview) {
      return res.status(404).json({ message: 'Seller review not found' });
    }
    res.status(200).json(updatedSellerReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


