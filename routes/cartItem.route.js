const express = require('express');
const router = express.Router();
const cartItemsController = require('../controllers/cartItem.controller');

// POST request - Create a new cart item
router.post('/', cartItemsController.createCartItem);

// PUT request - Update a cart item
router.put('/:id', cartItemsController.updateCartItem);

// DELETE request - Delete a cart item

router.delete('/:id', cartItemsController.deleteCartItem);

// GET request - Retrieve cart items by Email
router.get('/email/:email/status/:order_status', cartItemsController.getCartItemsByEmail);

router.put('/update-status/email/:email', cartItemsController.updateStatusByEmail);

router.put('/update-status/id/:id', cartItemsController.updateStatusById);

// GET request - Retrieve cart items by cart ID
router.get('/:cartId', cartItemsController.getCartItemsByCartId);

// GET request - Retrieve all cart items
router.get('/', cartItemsController.getAllCartItems);

module.exports = router;
