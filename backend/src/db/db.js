const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Don't exit process in serverless, just throw
    throw error;
  }
};

module.exports = connectDB;
