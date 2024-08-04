const conn = require('../util/database');

module.exports = class Product {
  constructor(id, product_name, price, stock_quantity, color, description, image_path, category) {
    this.id = id;
    this.product_name = product_name;
    this.price = price;
    this.stock_quantity = stock_quantity;
    this.color = color;
    this.description = description;
    this.image_path = image_path;
    this.category = category; // Include category in the constructor
  }

  // Retrieve all products
  static findAll(callback) {
    conn.query("SELECT * FROM products", (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, results);
      }
    });
  }

  // Retrieve product by ID
  static findById(productId, callback) {
    conn.query("SELECT * FROM products WHERE id = ?", [productId], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        if (results.length > 0) {
          callback(null, results[0]);
        } else {
          callback(null, { message: "Product not found" });
        }
      }
    });
  }

  // Create a new product
  static create(product, callback) {
    const { product_name, price, stock_quantity, color, description, image_path, category } = product; // Include category
    conn.query(
      "INSERT INTO products (product_name, price, stock_quantity, color, description, image_path, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [product_name, price, stock_quantity, color, description, image_path, category],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, { id: results.insertId, ...product });
        }
      }
    );
  }

  // Update a product
  static update(productId, updatedProduct, callback) {
    const { product_name, price, stock_quantity, color, description, image_path, category } = updatedProduct; // Include category
    conn.query(
      "UPDATE products SET product_name = ?, price = ?, stock_quantity = ?, color = ?, description = ?, image_path = ?, category = ? WHERE id = ?",
      [product_name, price, stock_quantity, color, description, image_path, category, productId],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, { message: "Product updated successfully" });
        }
      }
    );
  }

  // Delete a product
  static delete(productId, callback) {
    conn.query("DELETE FROM products WHERE id = ?", [productId], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, { message: "Product deleted successfully" });
      }
    });
  }

  // Retrieve products by category
  static findByCategory(category, callback) {
    conn.query("SELECT * FROM products WHERE category = ?", [category], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, results);
      }
    });
  }
};
