const Prescription = require('../models/prescription.model');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');


exports.createPrescription = async (req, res) => {
  const { customer_message, email } = req.body;
  let image_url = ''; // Initialize image_url as an empty string

  // Log incoming data
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);

  // Validate inputs
  if (!customer_message || !email) {
    return res.status(400).send({ message: 'Customer message and email are required.' });
  }

  // If there's a file in the request, upload it to Cloudinary
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `prescription_images/${Date.now()}-${req.file.originalname}`,
        folder: 'prescription_images',
      });

      // Store the Cloudinary secure_url (the full image URL)
      image_url = result.secure_url;

      // Log the full image URL
      console.log('Uploaded Image URL (Cloudinary secure_url):', image_url);

      // Remove the file from local storage
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.error('Error uploading prescription image to Cloudinary:', error);
      return res.status(500).json({ error: 'Failed to upload prescription image' });
    }
  }

  // Log the final image URL to be stored
  console.log('Final Image URL to be Stored:', image_url);

  // Create prescription
  Prescription.create(customer_message, email, image_url, (err, data) => {
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
