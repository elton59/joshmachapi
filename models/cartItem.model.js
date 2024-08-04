const conn = require('../util/database');

module.exports = class CartItem {
  constructor(id, cart_id, product_id, quantity, email, phone_number, created_at, updated_at) {
    this.id = id;
    this.cart_id = cart_id;
    this.product_id = product_id;
    this.quantity = quantity;
    this.email = email;
    this.phone_number = phone_number;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.order_status = order_status;
  }

  // Retrieve all cart items
  static findAll(callback) {
    conn.query("SELECT * FROM cart_items", (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, results);
      }
    });
  }

  // Retrieve cart items by cart ID
  static findByCartId(cartId, callback) {
    conn.query("SELECT * FROM cart_items WHERE cart_id = ?", [cartId], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, results);
      }
    });
  }

  // Retrieve cart items by email
  static findByEmail(email, order_status, callback) {
    const query = "SELECT * FROM cart_items WHERE email = ? AND order_status = ?";
    conn.query(query, [email, order_status], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, results);
      }
    });
  }

  // Update order status by ID
  static updateStatusById(id, orderStatus, callback) {
    conn.query(
      "UPDATE cart_items SET order_status = ? WHERE id = ?",
      [orderStatus, id],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          if (results.affectedRows > 0) {
            callback(null, { message: "Order status updated successfully" });
          } else {
            callback(null, { message: "Cart item not found" });
          }
        }
      }
    );
  }
    // Update order status by ID
  static updateStatusByEmail(email, orderStatus, callback) {
    conn.query(
      "UPDATE cart_items SET order_status = ? WHERE email = ? AND order_status = 'pending'",
      [orderStatus, email],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, { message: "Order status updated successfully" });
        }
      }
    );
  }

  // Create a new cart item
  static create(cart_id, product_id, quantity, email, phone_number, callback) {
    conn.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity, email, phone_number) VALUES (?, ?, ?, ?, ?)",
      [cart_id, product_id, quantity, email, phone_number],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, { id: results.insertId, cart_id, product_id, quantity, email, phone_number });
        }
      }
    );
  }

  // Update a cart item
  static update(cartItemId, updatedCartItem, callback) {
    const { cart_id, product_id, quantity, email, phone_number } = updatedCartItem;
    conn.query(
      "UPDATE cart_items SET cart_id = ?, product_id = ?, quantity = ?, email = ?, phone_number = ? WHERE id = ?",
      [cart_id, product_id, quantity, email, phone_number, cartItemId],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, { message: "Cart item updated successfully" });
        }
      }
    );
  }

  // Delete a cart item
  static delete(cartItemId, callback) {
    conn.query("DELETE FROM cart_items WHERE id = ?", [cartItemId], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, { message: "Cart item deleted successfully" });
      }
    });
  }
};
