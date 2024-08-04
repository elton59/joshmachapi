const Prescription = require('../models/prescription.model');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'prescription_images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });//upload not defined


//create prescription
exports.createPrescription = (req, res) => {
  const { customer_message, email } = req.body;
  const image = req.file ? `/prescription_images/${req.file.filename}` : '';

  // Log incoming data
  console.log('Request Body:', req.body);
console.log('Request File:', req.file);
  console.log('Received data:', {
    customer_message,
    email,
    image_path: image
  });

  // Validate inputs
  if (!customer_message || !email) {
    return res.status(400).send({ message: 'Customer message and email are required.' });
  }

  // Create prescription
  Prescription.create(customer_message, email, image, (err, data) => {
    if (err) {
      console.error('Error creating prescription:', err);
      return res.status(500).send({ message: 'Error creating prescription.' });
    }
    res.status(201).send(data);
  });
};

exports.getAllPrescriptions = (req, res) => {
  Prescription.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve prescriptions', error: err });
    }
    res.status(200).json(results);
  });
};

exports.getPrescriptionById = (req, res) => {
  const { id } = req.params;
  Prescription.findById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve prescription', error: err });
    }
    res.status(200).json(result);
  });
};

exports.updatePrescription = (req, res) => {
  const { id } = req.params;
  const updatedPrescription = req.body;

  Prescription.update(id, updatedPrescription, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to update prescription', error: err });
    }
    res.status(200).json(result);
  });
};

exports.deletePrescription = (req, res) => {
  const { id } = req.params;
  Prescription.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete prescription', error: err });
    }
    res.status(200).json(result);
  });
};
