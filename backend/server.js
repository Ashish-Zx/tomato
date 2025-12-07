const app = require("./src/app.js");
const connectDB = require("./src/db/db.js");

// Connect to DB immediately
connectDB();

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// For Vercel
module.exports = app;
