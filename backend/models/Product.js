const mongoose = require('mongoose');

// Define productSchema (name, SKU - unique, description, price, category)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  SKU: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

// Create model from schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
