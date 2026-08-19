const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.db_URL);
  console.log("database connection stablished");
};

module.exports = connectDB;
