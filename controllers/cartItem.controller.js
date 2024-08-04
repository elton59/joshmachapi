const CartItem = require('../models/cartItem.model');

// Retrieve all cart items
exports.getAllCartItems = (req, res) => {
  CartItem.findAll((err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch cart items" });
    }
    res.json(cartItems);
  });
};
// Create a new cart item
exports.createCartItem = (req, res) => {
  const { cart_id, product_id, quantity, email, phone_number } = req.body;

  if (!cart_id || !product_id || !quantity || !email || !phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  CartItem.create(cart_id, product_id, quantity, email, phone_number, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create cart item" });
    }
    res.status(201).json(result);
  });
};

// Update a cart item
exports.updateCartItem = (req, res) => {
  const { id } = req.params;
  const updatedCartItem = req.body;

  CartItem.update(id, updatedCartItem, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update cart item" });
    }
    res.json(result);
  });
};

// Handle GET request to retrieve cart items by cart ID
exports.getCartItemsByCartId = (req, res) => {
  const { cartId } = req.params;

  CartItem.findByCartId(cartId, (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch cart items" });
    }
    res.json(cartItems);
  });
};

// Get all cart items by email
const { validationResult } = require('express-validator');
const validator = require('validator'); // For email validation

// Get all cart items by email and order status
exports.getCartItemsByEmail = (req, res) => {
  const email = req.params.email;
  const order_status = req.params.order_status;

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  
  if (typeof order_status !== 'string' || order_status.trim() === '') {
    return res.status(400).json({ error: "Invalid order status" });
  }

  CartItem.findByEmail(email, order_status, (err, results) => {
    if (err) {
      console.error(`Error fetching cart items: ${err.message}`);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
};

//update Cart Status by Email
exports.updateStatusByEmail = (req, res) => {
  // Extract email from the request parameters
  const email = req.params.email;

  // Extract order_status from the request body
  const { order_status } = req.body;

  // Ensure that both email and order_status are provided
  if (!email || !order_status) {
    return res.status(400).json({ error: "Email and order_status are required" });
  }

  // Call the model method to update the status by email
  CartItem.updateStatusByEmail(email, order_status, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

//update Cart Status by ID
exports.updateStatusById = (req, res) => {
  // Extract id from the request parameters
  const id = req.params.id;

  // Extract order_status from the request body
  const { order_status } = req.body;

  // Ensure that both id and order_status are provided
  if (!id || !order_status) {
    return res.status(400).json({ error: "ID and order_status are required" });
  }

  // Call the model method to update the status by id
  CartItem.updateStatusById(id, order_status, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// Delete a cart item
exports.deleteCartItem = (req, res) => {
  const { id } = req.params;

  CartItem.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete cart item" });
    }
    res.json(result);
  });
};
