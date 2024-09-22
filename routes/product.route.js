const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');

const upload = multer({ dest: 'temp/' });

// Define routes
router.post('/add', productController.addProduct);
router.get('/details', productController.returnProductDetailsById);
router.get('/all', productController.returnAllProducts); // Adjusted route to '/all'
router.put('/update', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.get('/by-category', productController.findProductsByCategory); // Adjusted route to '/by-category'

// Endpoint to handle product image upload to Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: `product_images/${Date.now()}-${req.file.originalname}`, // Unique ID for Cloudinary
            folder: 'product_images', // Folder in Cloudinary
        });

        // Remove the file from local temp storage
        fs.unlinkSync(req.file.path);

        // Return the Cloudinary URL
        res.json({ imagePath: result.secure_url });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
    }
});

module.exports = router;
