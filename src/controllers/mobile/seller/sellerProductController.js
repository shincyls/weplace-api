// For Seller To Mange Product

const Product = require('../../../models/product/productModel');

// Get all products from seller Id in the token
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a product if only no active groupbuy or sale
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.groupbuys.startTime || product.groupbuys.endTime ) {
      return res.status(400).json({ message: 'Cannot update product with on-going groupbuy' });
    }
    if (product.sales.startTime || product.sales.endTime ) {
      return res.status(400).json({ message: 'Cannot update product with on-going sale' });
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

