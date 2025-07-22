// Seller Controllers are using by User to register as a seller in a location

const Seller = require('../../../models/seller/sellerModel');
const Product = require('../../../models/product/productModel');
const Sale = require('../../../models/sale/saleModel');
const Groupbuy = require('../../../models/groupbuy/groupBuyModel');
const SellerCreditBalance = require('../../../models/seller/sellerCreditBalanceModel');
const Payment = require('../../../models/payment/paymentModel');

// require('dotenv').config();

// Register as new seller
exports.createSeller = async (req, res) => {
  try {

    const newSeller = new Seller({
      userId: req.user_id,
      sellerName: req.body.sellerName,
      sellerEmail: req.body.sellerEmail,
      sellerType: req.body.sellerType,
      companyPhone: req.body.companyPhone,
      companyName: req.body.companyName,
      companyRegNo: req.body.companyRegNo,
      companyAddressLine1: req.body.companyAddressLine1,
      companyAddressLine2: req.body.companyAddressLine2,
      companyAddressLine3: req.body.companyAddressLine3,
      companyAddressCity: req.body.companyAddressCity,
      companyAddressState: req.body.companyAddressState,
      companyAddressPoscode: req.body.companyAddressPoscode,
      companyAddressCountry: req.body.companyAddressCountry,
      bankName: req.body.bankName,
      bankAccount: req.body.bankAccount,
      attachments: req.body.attachments
    });

    const savedSeller = await newSeller.save();

    await User.findByIdAndUpdate(
      req.user_id, 
      {"sellerId" : savedSeller._id}
    );

    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a seller by ID
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a seller by ID
exports.updateSellerById = async (req, res) => {
  try {
    const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a seller by ID
exports.deleteSellerById = async (req, res) => {
  try {
    const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
    if (!deletedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sellerTopUp = async (req, res) => {
  try {

    let paymentPayload = {};
    const seller = await Seller.findById(req.body.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const paymentGateway = req.body.paymentGateway;
    const amount = req.body.amount;
    const portal = req.body.portal;

    const remarks = req.body.remarks;

    const newTopUp = new SellerCreditBalance(req.body);
    const beforeBalance = req.body.sellerId.currentCredits;
    const afterBalance = beforeBalance + req.body.amount;
    newTopUp.amount = req.body.amount;
    newTopUp.sellerId = req.sellId;
    newTopUp.beforeBalance = beforeBalance;
    newTopUp.afterBalance = afterBalance;
    newTopUp.type = "topup";
    newTopUp.status = "processing";
    const savedTopUp = await newTopUp.save();

    // switch case depends payment gateway, fpx or stride or tng
    switch (paymentGateway.toLowerCase()) {
      case 'fpx':
        paymentPayload = {
          redirectUrl: 'https://www.tng.com.my/payment/checkout?paymentId=' + savedTopUp._id,
          paymentId: savedTopUp._id,
          paymentGateway: paymentGateway,
          amount: amount,
          remarks: remarks
        };
        break;
      case 'tng':
        paymentPayload = {
          redirectUrl: 'https://www.tng.com.my/payment/checkout?paymentId=' + savedTopUp._id,
          paymentId: savedTopUp._id,
          paymentGateway: paymentGateway,
          amount: amount,
          remarks: remarks
        };
        break;
      default:
        return res.status(400).json({ message: 'Payment gateway not found' });
        break;
    }

    res.status(200).json({ message: error.message, redirect: paymentPayload });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};

