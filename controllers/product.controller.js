const Product = require('../models/product.model');

// Add a new product to the database
exports.addProduct = (req, res) => {
    if (!req.body.product_name || !req.body.price || !req.body.stock_quantity || !req.body.category) {
        return res.status(400).json({ error: "Please fill in all the required fields" });
    }

    const { product_name, price, stock_quantity, color, description, image_path, category } = req.body;

    const product = new Product(
        null,
        product_name,
        price,
        stock_quantity,
        color || '', // Default empty string for optional fields
        description || '', // Default empty string for optional fields
        image_path || '', // Default empty string for optional fields
        category    
    );

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
        return res.status(400).json({ message: "Product ID is required" });
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
}

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
