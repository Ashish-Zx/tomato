const app = require("../src/app");
const connectDB = require("../src/db/db");

// Initialize DB connection
connectDB();

// Export the Express app
module.exports = app;
