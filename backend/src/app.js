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

app.use(express.json());
app.use(cookieParser()); // as a middleware

app.use("/api/auth", authRoutes);
app.use("/api/food", foodAuthRoutes);
app.use("/api/foodpartner", foodPartnerRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
