const Product = require('../models/productModel');
const ProductOrder = require('../models/productOrderModel');
const ProductOrderUser = require('../models/productOrderUserModel');
const ProductOrderUserReview = require('../models/productOrderUserReviewModel');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new product order
exports.createProductOrder = async (req, res) => {
    try {
        const productOrder = new ProductOrder(req.body);
        await productOrder.save();
        res.status(201).json(productOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all product orders
exports.getAllProductOrders = async (req, res) => {
    try {
        const productOrders = await ProductOrder.find();
        res.status(200).json(productOrders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single product order by ID
exports.getProductOrderById = async (req, res) => {
    try {
        const productOrder = await ProductOrder.findById(req.params.id);
        if (!productOrder) {
            return res.status(404).json({ error: 'Product order not found' });
        }
        res.status(200).json(productOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a product order by ID
exports.updateProductOrderById = async (req, res) => {
    try {
        const productOrder = await ProductOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!productOrder) {
            return res.status(404).json({ error: 'Product order not found' });
        }
        res.status(200).json(productOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a product order by ID
exports.deleteProductOrderById = async (req, res) => {
    try {
        const productOrder = await ProductOrder.findByIdAndDelete(req.params.id);
        if (!productOrder) {
            return res.status(404).json({ error: 'Product order not found' });
        }
        res.status(200).json({ message: 'Product order deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new product order user
exports.createProductOrderUser = async (req, res) => {
    try {
        const productOrderUser = new ProductOrderUser(req.body);
        await productOrderUser.save();
        res.status(201).json(productOrderUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all product order users
exports.getAllProductOrderUsers = async (req, res) => {
    try {
        const productOrderUsers = await ProductOrderUser.find();
        res.status(200).json(productOrderUsers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single product order user by ID
exports.getProductOrderUserById = async (req, res) => {
    try {
        const productOrderUser = await ProductOrderUser.findById(req.params.id);
        if (!productOrderUser) {
            return res.status(404).json({ error: 'Product order user not found' });
        }
        res.status(200).json(productOrderUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a product order user by ID
exports.updateProductOrderUserById = async (req, res) => {
    try {
        const productOrderUser = await ProductOrderUser.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!productOrderUser) {
            return res.status(404).json({ error: 'Product order user not found' });
        }
        res.status(200).json(productOrderUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a product order user by ID
exports.deleteProductOrderUserById = async (req, res) => {
    try {
        const productOrderUser = await ProductOrderUser.findByIdAndDelete(req.params.id);
        if (!productOrderUser) {
            return res.status(404).json({ error: 'Product order user not found' });
        }
        res.status(200).json({ message: 'Product order user deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new product user review
exports.createProductUserReview = async (req, res) => {
    try {
        const productUserReview = new ProductUserReview(req.body);
        await productUserReview.save();
        res.status(201).json(productUserReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all product user reviews
exports.getAllProductUserReviews = async (req, res) => {
    try {
        const productUserReviews = await ProductUserReview.find();
        res.status(200).json(productUserReviews);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single product user review by ID
exports.getProductUserReviewById = async (req, res) => {
    try {
        const productUserReview = await ProductUserReview.findById(req.params.id);
        if (!productUserReview) {
            return res.status(404).json({ error: 'Product user review not found' });
        }
        res.status(200).json(productUserReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a product user review by ID
exports.updateProductUserReviewById = async (req, res) => {
    try {
        const productUserReview = await ProductUserReview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!productUserReview) {
            return res.status(404).json({ error: 'Product user review not found' });
        }
        res.status(200).json(productUserReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a product user review by ID
exports.deleteProductUserReviewById = async (req, res) => {
    try {
        const productUserReview = await ProductUserReview.findByIdAndDelete(req.params.id);
        if (!productUserReview) {
            return res.status(404).json({ error: 'Product user review not found' });
        }
        res.status(200).json({ message: 'Product user review deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};