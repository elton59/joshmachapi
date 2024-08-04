const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// POST request - Create a new cart
router.post('/', cartController.createCart);

// GET request - Retrieve a cart by ID
router.get('/:id', cartController.getCartById);

// Route to get carts by session_id
router.get('/session/:sessionId', cartController.getCartBySessionId);

// PUT request - Update a cart
router.put('/:id', cartController.updateCart);

// DELETE request - Delete a cart
router.delete('/:id', cartController.deleteCart);

module.exports = router;
