const mongoose = require('mongoose');

// Define AuthSchema for User (name, email - unique, password)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
});

// Create model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;
