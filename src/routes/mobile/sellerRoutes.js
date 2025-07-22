const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/mobile/authMiddleware');

// Seller main actions
const sellerController = require('../../controllers/mobile/seller/sellerController');
router.post('/register', checkAuth, sellerController.createSeller);
router.get('/:id', checkAuth, sellerController.getSellerById);
router.post('/update', checkAuth, sellerController.updateSellerById);
router.delete('/:id/remove', checkAuth, sellerController.deleteSellerById);
router.post('/topup', checkAuth, sellerController.sellerTopUp);

// Product actions
const sellerProductController = require('../../controllers/mobile/seller/sellerProductController');
router.get('/products', checkAuth, sellerProductController.getSellerProducts);
router.post('/product', checkAuth, sellerProductController.createProduct);
router.post('/product/update', checkAuth, sellerProductController.updateProduct);

// Sale actions
const sellerSaleController = require('../../controllers/mobile/seller/sellerSaleController');
router.get('/sales', checkAuth, sellerSaleController.getSellerSales);
router.post('/sale', checkAuth, sellerSaleController.createSale);
router.post('/sale/update', checkAuth, sellerSaleController.updateSale);
router.post('/sale/recreate', checkAuth, sellerSaleController.recreateSale);

// Groupbuy actions
const sellerGroupbuyController = require('../../controllers/mobile/seller/sellerGroupbuyController');
router.get('/groupbuys', checkAuth, sellerGroupbuyController.getSellerGroupBuy);
router.post('/groupbuy', checkAuth, sellerGroupbuyController.createGroupbuy);
router.post('/groupbuy/update', checkAuth, sellerGroupbuyController.updateGroupbuy);
router.post('/groupbuy/recreate', checkAuth, sellerGroupbuyController.recreateGroupbuy);

module.exports = router;

