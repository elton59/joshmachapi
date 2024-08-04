const conn = require('../util/database');

module.exports = class Prescription {
  constructor(id, customer_message, customer_email, image_path) {
    this.id = id;
    this.customer_message = customer_message;
    this.customer_email = customer_email;
    this.image_path = image_path;
  }

  // Retrieve all prescriptions
  static findAll(callback) {
    conn.query("SELECT * FROM prescriptions", (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, results);
      }
    });
  }

  // Retrieve prescription by ID
  static findById(prescriptionId, callback) {
    conn.query("SELECT * FROM prescriptions WHERE id = ?", [prescriptionId], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        if (results.length > 0) {
          callback(null, results[0]);
        } else {
          callback(null, { message: "Prescription not found" });
        }
      }
    });
  }

 // create prescription
 static create(customer_message, customer_email, image_path, callback) {
  conn.query(
    "INSERT INTO prescriptions (customer_message, customer_email, image_path) VALUES (?, ?, ?)",
    [customer_message, customer_email, image_path],
    (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, { id: results.insertId, customer_message, customer_email, image_path });
      }
    }
  );
}


  // Update a prescription
  static update(prescriptionId, updatedPrescription, callback) {
    const { customer_message, customer_email, image_path } = updatedPrescription;
    conn.query(
      "UPDATE prescriptions SET customer_message = ?, customer_email = ?, image_path = ? WHERE id = ?",
      [customer_message, customer_email, image_path, prescriptionId],
      (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${err}`);
          callback({ error: "Internal server error" });
        } else {
          callback(null, { message: "Prescription updated successfully" });
        }
      }
    );
  }

  // Delete a prescription
  static delete(prescriptionId, callback) {
    conn.query("DELETE FROM prescriptions WHERE id = ?", [prescriptionId], (err, results) => {
      if (err) {
        console.error(`Error executing SQL: ${err}`);
        callback({ error: "Internal server error" });
      } else {
        callback(null, { message: "Prescription deleted successfully" });
      }
    });
  }
};
