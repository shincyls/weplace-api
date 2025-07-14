// Seller Controllers are using by User to register as a seller in a location

const Seller = require('../models/sellersellerModel');
const Product = require('../models/product/productModel');
const Sale = require('../models/sale/saleModel');
const Groupbuy = require('../models/groupbuy/groupBuyModel');

// Register as new seller
exports.createSeller = async (req, res) => {
  try {
    const newSeller = new Seller(req.body);
    const savedSeller = await newSeller.save();
    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product order
exports.createProductOrder = async (req, res) => {
  try {
    const newProductOrder = new ProductOrder(req.body);
    const savedProductOrder = await newProductOrder.save();
    res.status(201).json(savedProductOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all product orders
exports.getAllProductOrders = async (req, res) => {
  try {
    const productOrders = await ProductOrder.find();
    res.status(200).json(productOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product order by ID
exports.getProductOrderById = async (req, res) => {
  try {
    const productOrder = await ProductOrder.findById(req.params.id);
    if (!productOrder) {
      return res.status(404).json({ message: 'Product order not found' });
    }
    res.status(200).json(productOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product order by ID
exports.updateProductOrderById = async (req, res) => {
  try {
    const updatedProductOrder = await ProductOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProductOrder) {
      return res.status(404).json({ message: 'Product order not found' });
    }
    res.status(200).json(updatedProductOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product order by ID
exports.deleteProductOrderById = async (req, res) => {
  try {
    const deletedProductOrder = await ProductOrder.findByIdAndDelete(req.params.id);
    if (!deletedProductOrder) {
      return res.status(404).json({ message: 'Product order not found' });
    }
    res.status(200).json({ message: 'Product order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

