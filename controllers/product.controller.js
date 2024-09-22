const Product = require('../models/product.model');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');

// Add a new product to the database
exports.addProduct = async (req, res) => {
    // Ensure all required fields are provided
    if (!req.body.product_name || !req.body.price || !req.body.stock_quantity || !req.body.category) {
        return res.status(400).json({ error: "Please fill in all the required fields" });
    }

    const { product_name, price, stock_quantity, color, description, category } = req.body;
    let image_path = ''; // Initialize image_path as an empty string

    // If there's a file in the request, upload it to Cloudinary
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                public_id: `product_images/${Date.now()}-${req.file.originalname}`,
                folder: 'product_images',
            });
    
            // Store the public_id (which includes the folder and file name) in image_path
            
            image_path = result.public_id;
          
    
            // Remove the file from local storage
            fs.unlinkSync(req.file.path);
        } catch (error) {
            console.error('Error uploading product image to Cloudinary:', error);
            return res.status(500).json({ error: 'Failed to upload image' });
        }
    } else {
        // If no file was uploaded, use the image_path from the request body (if provided)
        image_path = req.body.image_path || ''; 
    }
    
    // Create a new product object with the Cloudinary public_id (image path)
    const product = new Product(
        null,
        product_name,
        price,
        stock_quantity,
        color || '', // Default empty string for optional fields
        description || '', // Default empty string for optional fields
        image_path, // Now this contains the Cloudinary public_id (e.g., product_images/filename.jpeg)
        category    
    );
    
    // Insert product into the database
    Product.create(product, (err, results) => {
        if (err) {
            console.error('Error creating product:', err);
            return res.status(500).json({ error: 'Error inserting values in the database' });
        }
        res.status(201).json(results);
    });
};

// Return product details by ID
exports.returnProductDetailsById = (req, res) => {
    const productId = req.query.id;
    if (!productId) {
        return res.status(400).json({ error: "Please provide a product ID" });
    }

    Product.findById(productId, (err, product) => {
        if (err) {
            console.error('Error finding product by ID:', err);
            return res.status(500).json({ error: 'Error retrieving product details' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    });
};

// Return all product details
exports.returnAllProducts = (req, res) => {
    Product.findAll((err, products) => {
        if (err) {
            console.error('Error retrieving products:', err);
            return res.status(500).json({ error: 'Error retrieving products' });
        }
        res.json(products);
    });
};

// Update product details
exports.updateProduct = (req, res) => {
    const productId = req.body.id;
    if (!productId) {
        return res.status(400).json({ message
            : "Product ID is required" });
        }
    
        const { product_name, price, stock_quantity, color, description, image_path, category } = req.body;
    
        const updatedProduct = {
            product_name,
            price,
            stock_quantity,
            color: color || '', // Default empty string for optional fields
            description: description || '', // Default empty string for optional fields
            image_path: image_path || '', // Default empty string for optional fields
            category
        };
    
        Product.update(productId, updatedProduct, (err, results) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).json({ error: 'Error updating product details' });
            }
            res.json({ message: 'Product updated successfully' });
        });
    };
    
    // Delete a product
    exports.deleteProduct = (req, res) => {
        const productId = req.params.id;
    
        // Validate product ID
        if (!productId) {
            return res.status(400).json({ error: "Please provide a product ID" });
        }
    
        Product.delete(productId, (err, results) => {
            if (err) {
                console.error('Error deleting product:', err);
                return res.status(500).json({ error: 'Error deleting product' });
            }
            res.json({ message: 'Product deleted successfully' });
        });
    };
    
    // Controller method to find products by category
    exports.findProductsByCategory = (req, res) => {
        const category = req.query.category;
        if (!category) {
            return res.status(400).json({ error: 'Please provide a category' });
        }
    
        Product.findByCategory(category, (err, products) => {
            if (err) {
                console.error('Error finding products by category:', err);
                return res.status(500).json({ error: 'Error retrieving products by category' });
            }
    
            res.json(products);
        });
    };


    