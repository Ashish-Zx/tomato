const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require("./routes/auth.routes");
const foodAuthRoutes = require("./routes/food.auth.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const userRoutes = require("./routes/user.routes");
const cors = require("cors");

// Simple CORS - allow all origins for now
app.use(cors({
  origin: true,
  credentials: true
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());
app.use(cookieParser()); // as a middleware

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Global DB Reconnect Middleware
const mongoose = require('mongoose');
const connectDB = require("./db/db");
let lastDbError = null; // Store error to show on frontend

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
      lastDbError = null; // Clear error on success
    } catch (e) {
      console.error("Failed to reconnect DB:", e);
      lastDbError = e.message; // Capture error
    }
  }
  next();
});

// Explicit DB Connection Test Route
app.get("/api/test-db", async (req, res) => {
  try {
    const connectDB = require("./db/db");
    await connectDB();
    res.json({
      status: "success",
      message: "Successfully connected to MongoDB!",
      state: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to connect to MongoDB",
      error_name: error.name,
      error_message: error.message,
      error_code: error.code
    });
  }
});

// Health Check Route
app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

  res.status(200).json({
    status: "ok",
    message: "Tomato Backend is running",
    db_status: states[dbState] || "unknown",
    last_db_error: lastDbError,
    env_check: {
      mongo_defined: !!process.env.MONGO_URI,
      jwt_defined: !!process.env.JWT_SECRET,
      imagekit_defined: !!process.env.IMAGEKIT_PRIVATE_KEY
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodAuthRoutes);
app.use("/api/foodpartner", foodPartnerRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
