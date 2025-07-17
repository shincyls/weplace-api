// For User To Order a Product Sale and Groupbuy

const SaleOrderUser = require('../models/sale/saleOrderUserModel');
const GroupbuyOrder = require('../models/groupbuy/groupBuyOrderModel');

// Create a new product order user
exports.createSaleOrderUser = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.locationId = req.location.id;
    data.orderUnit = req.body.orderUnit;
    data.orderRemarks = req.body.orderRemarks;
    data.orderOption = req.body.orderOption;

    const newSaleOrderUser = new SaleOrderUser(data);
    const savedSaleOrderUser = await newSaleOrderUser.save();
    res.status(201).json(savedSaleOrderUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new groupbuy order
exports.createGroupbuyOrder = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.locationId = req.location.id;
    data.orderUnit = req.body.orderUnit;
    data.orderRemarks = req.body.orderRemarks;
    data.orderOption = req.body.orderOption;

    const newGroupbuyOrder = new GroupbuyOrder(data);
    const savedGroupbuyOrder = await newGroupbuyOrder.save();
    res.status(201).json(savedGroupbuyOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

