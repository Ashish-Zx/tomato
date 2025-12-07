const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require("./routes/auth.routes");
const foodAuthRoutes = require("./routes/food.auth.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const userRoutes = require("./routes/user.routes");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://tomato-fe-murex.vercel.app",  // Production frontend
  "https://tomato-frontend.vercel.app",
  "https://tomato-bc76.vercel.app",
  /\.vercel\.app$/  // Allow any Vercel domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        return allowed === origin;
      })) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

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
