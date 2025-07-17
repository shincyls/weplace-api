const Location = require('../models/location/locationModel');
const sellerCreditBalance = require('../models/seller/sellerCreditBalanceModel');
const userCreditBalance = require('../models/user/userCreditBalanceModel');
const paymentGateway = require('../models/payment/paymentModel');

exports.paymentGatewayResponse = async (req, res) => {
  try {
    
      const payment = await paymentGateway.findById(req.body.paymentId);
      const sellerId = payment.sellerId;
      if (!payment) {
        return res.status(404).json({
          status: 'fail',
          message: 'No payment found with that ID'
        });
      }

      // Update Payment Status
      payment.status = "success";
      payment.meteData = req.body;

      await payment.save();

      // Update SellerCreditBalance Status
      const sellerCredit = await sellerCreditBalance.findById(sellerId);
      if (!sellerCredit) {
        return res.status(404).json({
          status: 'fail',
          message: 'No seller credit found with that ID'
        });
      }
      sellerCredit.status = req.body.status;

      // Update SellerCurrentCredit
      const seller = await Seller.findById(req.body.sellerId);
      if (!seller) {
        return res.status(404).json({
          status: 'fail',
          message: 'No seller found with that ID'
        });
      }
      seller.currentCredits = req.body.currentCredits;
      await seller.save();
    
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};