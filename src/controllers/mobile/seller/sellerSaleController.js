// For Seller To Mange Sale

const Product = require('../models/product/productModel');
const Sale = require('../models/sale/saleModel');
const { Seller } = require('../../../models/seller/sellerModel');
const SellerCreditBalance = require('../../../models/seller/sellerCreditBalanceModel');

// Get all sales from seller Id in the token
exports.getSellerSales = async (req, res) => {
  try {

    const seller = await Seller.findById(req.seller_id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const sales = await Sale.find({ sellerId: req.seller_id });
    res.status(200).json(sales);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new sale
exports.createSale = async (req, res) => {
    try {

      // Validations
      const seller = await Seller.findById(req.seller_id);

      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }

      const locations = await Location.find({
        _id: { $in: req.body.locationIds }
      });

      // Exclude Payment for locations if less than certain population
      // const minPopulationForPayment = 20;
      // const locationsToBePaid = locations.filter(location => location.population >= minPopulationForPayment);

      if (!locations || locations.length === 0) {
        return res.status(404).json({ message: 'Locations not found' });
      }

      const taxRate = 0.06; // 6% SST/GST, make this configurable if needed
      const weeklyFeesTaxInclusive = 2;
      const weeks = req.body.weeks;
      const fees = weeks * weeklyFeesTaxInclusive;
      const totalFees = locations.length * fees;

      if (seller.currentCredits < totalFees) {
        return res.status(400).json({ message: 'Not enough credits, needed total ' + totalFees + ' credits (including tax)' });
      }

      // Proceed Deduct Seller Credits & Create Sale
      const newSale = new Sale({
        sellerId: req.seller_id,
        productId: req.body.productId,
        originalPrice: req.body.originalPrice,
        sellingPrice: req.body.sellingPrice,
        stock: req.body.stock,
        businessHour: req.body.businessHour,
        startTime: req.body.startTime,
        endTime: new Date(req.body.startTime.getTime() + (weeks * 7 * 24 * 60 * 60 * 1000)),
        locationIds: req.body.locationIds
      });
      const savedSale = await newSale.save();

      // Create SellerCreditBalance record

      const beforeBalance = seller.currentCredits;
      const afterBalance = beforeBalance - totalFees;
      const creditRecord = new SellerCreditBalance({
        sellerId: seller._id,
        amount: -totalFees,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        remarks: 'Sale Creation',
        reason: 'sale',
        ref: newSale._id,
        info: weeks + 'Weeks, ' + locations.length + 'Locations',
        type: 'debit',
        status: 'success',
        createdBy: req.user_id,
        taxType: 'SST',
        taxRate: taxRate,
        taxAmount: totalFees * taxRate / (1 + taxRate)
      });
      await creditRecord.save();

      // Update Seller Current Credits
      seller.currentCredits = afterBalance;
      await seller.save();
      
      // Return Result
      res.status(201).json(savedSale);

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

exports.updateSale = async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const action = req.body.action;

    // Validate No Active Orders

    if (action == 'delete') {
      updatedSale.isActive = false;
    }

    if (action == 'cancel') {
      updatedSale.status = 'cancelled';
    }

    await updatedSale.save();

    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.recreateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.body.saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.status !== 'fail') {
      return res.status(400).json({ message: 'Sale is not fail' });
    }

    sale.status = 'on-going';
    await sale.save();
    res.status(200).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

