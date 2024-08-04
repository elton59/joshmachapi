const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Define routes
router.post('/add', productController.addProduct);
router.get('/details', productController.returnProductDetailsById);
router.get('/all', productController.returnAllProducts); // Adjusted route to '/all'
router.put('/update', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.get('/by-category', productController.findProductsByCategory); // Adjusted route to '/by-category'

module.exports = router;
