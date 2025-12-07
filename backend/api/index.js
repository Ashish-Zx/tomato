// Initialize DB connection
try {
    const app = require("../src/app");
    const connectDB = require("../src/db/db");

    connectDB();
    module.exports = app;
} catch (error) {
    console.error("CRITICAL ERROR STARTING APP:", error);
    // Return a fallback error handler so Vercel doesn't crash 500 without logs
    module.exports = (req, res) => {
        res.status(500).json({
            message: "Critical Backend Startup Error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    };
}
