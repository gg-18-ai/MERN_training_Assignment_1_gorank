const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Setup Middlewares
app.use(express.json()); // Parses incoming JSON data in req.body
app.use(cookieParser()); // Parses incoming cookies in req.cookies

// Connect to MongoDB Database using Mongoose
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/assignment1_db';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Database connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Mount Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Root route to test if server is running
app.get('/', (req, res) => {
  res.send('Backend Server is running successfully!');
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
