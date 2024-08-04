const Cart = require('../models/cart.model');

// Handle POST request to create a new cart
exports.createCart = (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  Cart.create(session_id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create cart" });
    }
    res.status(201).json(result);
  });
};

// Handle GET request to retrieve cart by ID
exports.getCartById = (req, res) => {
  const { id } = req.params;

  Cart.findById(id, (err, cart) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch cart" });
    }
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart);
  });
};

// Retrieve carts by session_id
exports.getCartBySessionId = (req, res) => {
  const sessionId = req.params.sessionId;

  Cart.findBySessionId(sessionId, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    } else if (results.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    } else {
      res.status(200).json(results);
    }
  });
};

// Handle PUT request to update an existing cart
exports.updateCart = (req, res) => {
  const { id } = req.params;
  const updatedCart = req.body;

  Cart.update(id, updatedCart, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update cart" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json({ id, ...updatedCart });
  });
};

// Handle DELETE request to delete a cart
exports.deleteCart = (req, res) => {
  const { id } = req.params;

  Cart.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete cart" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json({ message: "Cart deleted successfully" });
  });
};
