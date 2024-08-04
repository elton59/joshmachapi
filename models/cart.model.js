const conn = require('../util/database');

module.exports = class Cart {
  constructor(id, session_id, created_at, updated_at) {
    this.id = id;
    this.session_id = session_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Retrieve all carts
  static findAll(callback) {
    conn.query("SELECT * FROM cart", (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, results);
      }
    });
  }

  // Retrieve cart by ID
  static findById(cartId, callback) {
    conn.query("SELECT * FROM cart WHERE id = ?", [cartId], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        if (results.length > 0) {
          callback(null, results[0]);
        } else {
          callback(null, { message: "Cart not found" });
        }
      }
    });
  }

  // Create a new cart
  static create(session_id, callback) {
    conn.query(
      "INSERT INTO cart (session_id) VALUES (?)",
      [session_id],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, { id: results.insertId, session_id });
        }
      }
    );
  }

    // Retrieve cart by session_id
    static findBySessionId(sessionId, callback) {
      conn.query("SELECT * FROM cart WHERE session_id = ?", [sessionId], (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, results);
        }
      });
    }

  // Update a cart
  static update(cartId, updatedCart, callback) {
    const { session_id } = updatedCart;
    conn.query(
      "UPDATE cart SET session_id = ? WHERE id = ?",
      [session_id, cartId],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, { message: "Cart updated successfully" });
        }
      }
    );
  }

  // Delete a cart
  static delete(cartId, callback) {
    conn.query("DELETE FROM cart WHERE id = ?", [cartId], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, { message: "Cart deleted successfully" });
      }
    });
  }
};
