// For User To Report a Product or Seller

const ProductReport = require('../../../models/product/productReportModel');
const SellerReport = require('../../../models/seller/sellerReportModel');

// Create a new product report
exports.createProductReport = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.productId = req.body.product_id;
    data.reportReason = req.body.reportReason;
    data.reportRemarks = req.body.reportRemarks;
    data.reportAttachments = req.body.reportAttachments;

    const newProductReport = new ProductReport(data);
    const savedProductReport = await newProductReport.save();
    res.status(201).json(savedProductReport);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new seller report
exports.createSellerReport = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.sellerId = req.body.seller_id;
    data.reportReason = req.body.reportReason;
    data.reportRemarks = req.body.reportRemarks;
    data.reportAttachments = req.body.reportAttachments;
    
    const newSellerReport = new SellerReport(data);
    const savedSellerReport = await newSellerReport.save();
    res.status(201).json(savedSellerReport);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

