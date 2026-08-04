const express = require('express');
const Product = require('../models/Product');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect middleware to ALL product routes below
router.use(protect);

// ==========================================
// 1. CREATE PRODUCT API
// Route: POST /api/products/create
// ==========================================
router.post('/create', async (req, res) => {
  try {
    const { name, SKU, description, price, category } = req.body;

    // Validation check
    if (!name || !SKU || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'All fields (name, SKU, description, price, category) are required.' });
    }

    // Product exist check (by unique SKU)
    const existingProduct = await Product.findOne({ SKU });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this SKU already exists.' });
    }

    // Create product and save to database
    const newProduct = new Product({
      name,
      SKU,
      description,
      price,
      category,
    });

    await newProduct.save();

    // Response to client
    return res.status(201).json({
      message: 'Product created successfully!',
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating product.', error: error.message });
  }
});

// ==========================================
// 2. GET ALL PRODUCTS API (with pagination, sort, skip, limit, select)
// Route: GET /api/products/getAll
// ==========================================
router.get('/getAll', async (req, res) => {
  try {
    // Read query parameters with defaults (page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip: (page - 1) * limit
    const skip = (page - 1) * limit;

    // Fetch data from DB using select(), sort(), skip(), limit()
    const products = await Product.find()
      .select('name SKU description price category createdAt') // select specific fields
      .sort({ createdAt: -1 })                              // sort newest first
      .skip(skip)                                          // skip records for pagination
      .limit(limit);                                       // limit number of records returned

    // Get total count of products for meta info
    const totalProducts = await Product.countDocuments();

    // Response to client
    return res.status(200).json({
      message: 'Products fetched successfully!',
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching products.', error: error.message });
  }
});

// ==========================================
// 3. GET PRODUCT BY ID API
// Route: GET /api/products/getSingleProduct/:id
// ==========================================
router.get('/getSingleProduct/:id', async (req, res) => {
  try {
    // req.params.id gets the product ID from URL parameter
    const productId = req.params.id;

    // Fetch data from DB
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Response to client
    return res.status(200).json({
      message: 'Product fetched successfully!',
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching single product.', error: error.message });
  }
});

// ==========================================
// 4. UPDATE PRODUCT API
// Route: PATCH /api/products/updateSingleProduct/:id
// ==========================================
router.patch('/updateSingleProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    // Validation check: ensure request body is not empty
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update.' });
    }

    // Check if product exists in database
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Update to DB with validation enabled
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    );

    // Response to client
    return res.status(200).json({
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating product.', error: error.message });
  }
});

// ==========================================
// 5. DELETE PRODUCT API
// Route: DELETE /api/products/deleteProduct/:id
// ==========================================
router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists in database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Delete product from DB
    await Product.findByIdAndDelete(productId);

    // Response to client
    return res.status(200).json({
      message: 'Product deleted successfully!',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting product.', error: error.message });
  }
});

module.exports = router;
