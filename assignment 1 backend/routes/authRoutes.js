const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ==========================================
// 1. REGISTRATION API
// Route: POST /api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation check: ensure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
    }

    // Check if user already exists in database by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Password hash using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Response to client
    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// ==========================================
// 2. LOGIN API
// Route: POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation check
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User does not exist.' });
    }

    // Password match check using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Wrong password.' });
    }

    // JWT token create with user payload
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'mysecretkey12345',
      { expiresIn: '1d' }
    );

    // Cookie set in response
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    // Response to client
    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// ==========================================
// 3. LOGOUT API
// Route: POST /api/auth/logout
// ==========================================
router.post('/logout', async (req, res) => {
  try {
    // Clear cookie -> token delete
    res.clearCookie('token');

    // Response to client
    return res.status(200).json({ message: 'Logout successful! Token deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during logout.', error: error.message });
  }
});

module.exports = router;
