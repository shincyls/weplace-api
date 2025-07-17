// For Seller To Mange Product
const Product = require('../models/product/productModel');
const Groupbuy = require('../models/groupbuy/groupBuyModel');
const { Seller } = require('../../../models/seller/sellerModel');
const SellerCreditBalance = require('../../../models/seller/sellerCreditBalanceModel');

// Get all products from seller Id in the token
exports.getSellerGroupbuy = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new product
exports.createGroupbuy = async (req, res) => {
    try {
      // Get seller by user id from token
      const seller = await Seller.findOne({ userId: req.user.id });
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
      if (seller.currentCredits < 5) {
        return res.status(400).json({ message: 'Not enough credits' });
      }
      // Deduct 5 credits
      const beforeBalance = seller.currentCredits;
      const afterBalance = beforeBalance - 5;
      seller.currentCredits = afterBalance;
      await seller.save();
      // Create product
      const newProduct = new Product({ ...req.body, sellerId: seller._id });
      const savedProduct = await newProduct.save();
      // Create SellerCreditBalance record
      const creditRecord = new SellerCreditBalance({
        sellerId: seller._id,
        productId: savedProduct._id,
        amount: -5,
        beforeBalance,
        afterBalance,
        remarks: 'Groupbuy creation',
        type: 'debit',
        status: 'success',
        createdBy: req.user.id
      });
      await creditRecord.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};
