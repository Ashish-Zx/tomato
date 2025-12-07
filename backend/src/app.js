const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require("./routes/auth.routes");
const foodAuthRoutes = require("./routes/food.auth.routes");

app.use(express.json());
app.use(cookieParser()); // as a middleware

app.use("/api/auth", authRoutes);
app.use("/api/food", foodAuthRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
