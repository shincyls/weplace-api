const express = require('express');

const {
  getAllSellers,
  createSeller,
  getSellerById,
  updateSellerById,
  deleteSellerById,
  getAllProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProductOrders,
  createProductOrder,
  getProductOrderById,
  updateProductOrderById,
  deleteProductOrderById
} = require('../controllers/sellerController');

const router = express.Router();
const checkAuth = require('../middleware/authMiddleware');
// const logger = require('../middleware/loggerMiddleware');

// Basic CRUD
router.get('/', checkAuth, getAllSellers);
router.post('/', checkAuth, createSeller);
router.get('/:id', checkAuth, getSellerById);
router.put('/:id/update', checkAuth, updateSellerById);
router.delete('/:id/remove', checkAuth, deleteSellerById);

// Basic CRUD for Products
router.get('/products', checkAuth, getAllProducts);
router.post('/product/add', checkAuth, createProduct);
router.get('/product/:id', checkAuth, getProductById);
router.put('/product/:id/update', checkAuth, updateProductById);
router.delete('/product/:id/remove', checkAuth, deleteProductById);

// Basic CRUD for Product Order
router.get('/orders', checkAuth, getAllProductOrders);
router.post('/order/add', checkAuth, createProductOrder);
router.get('/order/:id', checkAuth, getProductOrderById);
router.put('/order/:id/update', checkAuth, updateProductOrderById);
router.delete('/order/:id/remove', checkAuth, deleteProductOrderById);

module.exports = router;

