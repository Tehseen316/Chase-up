const Product = require('../models/Product');

// @desc   Get all products
// @route  GET /api/products
// @access Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// @desc   Add new product
// @route  POST /api/products
// @access Public
exports.addProduct = async (req, res) => {
    try {
        console.log("Received data:", req.body);

        const { name, price, quantityInStock, category, sku, cost } = req.body;

        if (!name || !price || !quantityInStock || !category) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newProduct = await Product.create({
            name,
            price,
            quantityInStock,
            category,
            sku: sku || `SKU-${Date.now()}`, // Auto-generate SKU if not provided
            cost: cost || price * 0.8 // Assume cost is 80% of price if not provided
        });

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// @desc   Edit product
// @route  PUT /api/products/:id
// @access Public
exports.editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, quantityInStock, category, sku, cost } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!Object.keys(req.body).length) {
            return res.status(400).json({ error: 'No updates provided' });
        }

        product.name = name ?? product.name;
        product.price = price ?? product.price;
        product.quantityInStock = quantityInStock ?? product.quantityInStock;
        product.category = category ?? product.category;
        product.sku = sku ?? product.sku;
        product.cost = cost ?? product.cost;

        await product.save();
        res.json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc   Delete product
// @route  DELETE /api/products/:id
// @access Public
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully', deletedProduct: product });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: 'Server error' });
    }
};
