// For User To Order a Product Sale and Groupbuy

const SaleOrder = require('../../../models/sale/saleOrderModel');
const GroupBuyOrder = require('../../../models/groupbuy/groupBuyOrderModel');

// Create a new product order user
exports.createSaleOrderUser = async (req, res) => {
  try {

    let order = req.body;
    order.userId = req.user.id;
    order.locationId = req.location.id;
    order.orderUnit = req.body.orderUnit;
    order.orderRemarks = req.body.orderRemarks;
    order.orderOption = req.body.orderOption;

    const newSaleOrder = new SaleOrderUser(order);
    const savedSaleOrder = await newSaleOrder.save();
    res.status(201).json(savedSaleOrder);

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

