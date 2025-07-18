// For Seller To Mange Groupbuy

const { GroupBuy } = require('../../../models/groupbuy/groupBuyModel');
const { Seller } = require('../../../models/seller/sellerModel');
const SellerCreditBalance = require('../../../models/seller/sellerCreditBalanceModel');

// Get all groupBuys from seller Id in the token
exports.getSellerGroupBuy = async (req, res) => {
  try {

    const seller = await Seller.findById(req.seller_id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const groupBuys = await GroupBuy.find({ sellerId: req.seller_id });
    res.status(200).json(groupBuys);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new groupbuy
exports.createGroupbuy = async (req, res) => {
    try {

      // Validations
      const seller = await Seller.findById(req.seller_id);
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
      const locations = await Location.find({
        _id: { $in: req.body.locationIds }
      });
      if (!locations || locations.length === 0) {
        return res.status(404).json({ message: 'Locations not found' });
      }

      const extraLocations = locations.length - 1;
      const extraFeeLocations = extraLocations * 2;
      const days = 30;
      const taxRate = 0.06; // 6% SST/GST, make this configurable if needed
      const monthlyFeesTaxInclusive = 10;
      const totalFees = (1 * monthlyFeesTaxInclusive) + (extraFeeLocations); 
      
      if (seller.currentCredits < totalFees) {
        return res.status(400).json({ message: 'Not enough credits, needed total ' + totalFees + ' credits (including tax)' });
      }

      // Calculate tax portion from inclusive total
      const taxAmount = totalFees * taxRate / (1 + taxRate);

      // Proceed Deduct Seller Credits & Create GroupBuy
      const newGroupbuy = new GroupBuy({
        sellerId: req.seller_id,
        productId: req.body.productId,
        basePrice: req.body.basePrice,
        maxUnits: req.body.maxUnits,
        mustMinTier: req.body.mustMinTier,
        tierPricing: req.body.tierPricing, // [{ tierUnit: 10, tierPrice: 100 }, { tierUnit: 20, tierPrice: 90 }, { tierUnit: 30, tierPrice: 80 }]
        deliveryRemarks: req.body.deliveryRemarks,
        startTime: req.body.startTime,
        endTime: new Date(req.body.startTime.getTime() + (days * 24 * 60 * 60 * 1000)), // 30 days
        locationIds: req.body.locationIds
      });
      const savedGroupbuy = await newGroupbuy.save();

      // Create SellerCreditBalance record
      const beforeBalance = seller.currentCredits;
      const afterBalance = beforeBalance - totalFees;
      const creditRecord = new SellerCreditBalance({
        sellerId: seller._id,
        productId: req.body.productId,
        amount: -totalFees,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        remarks: 'Groupbuy Creation',
        reason: 'groupbuy',
        ref: savedGroupbuy._id,
        info: days + ' Days, ' + extraLocations + 'Extra Locations',
        type: 'debit',
        status: 'success',
        createdBy: req.user_id,
        taxType: 'SST',
        taxRate: taxRate,
        taxAmount: taxAmount
      });
      await creditRecord.save();
      // Update Seller Current Credits
      seller.currentCredits = afterBalance;
      await seller.save();
      // Return Result
      res.status(201).json(savedGroupbuy);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

exports.updateGroupbuy = async (req, res) => {
  try {

    const updatedGroupbuy = await GroupBuy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedGroupbuy) {
      return res.status(404).json({ message: 'Groupbuy not found' });
    }

    const action = req.body.action;

    // Validate No Active Orders

    if (action == 'delete') {
      updatedGroupbuy.isActive = false;
    }

    if (action == 'cancel') {
      updatedGroupbuy.status = 'cancelled';
    }

    await updatedGroupbuy.save();
    
    res.status(200).json(updatedGroupbuy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.recreateGroupbuy = async (req, res) => {

  const groupBuy = await GroupBuy.findById(req.body.groupBuyId);
  if (!groupBuy) {
    return res.status(404).json({ message: 'Groupbuy not found' });
  }

  if (groupBuy.status !== 'fail') {
    return res.status(400).json({ message: 'Groupbuy is not fail' });
  }

  groupBuy.status = 'on-going';
  await groupBuy.save();
  res.status(200).json(groupBuy);

};

