// Debugging startup crash
let stage = "init";
try {
    stage = "loading_db_module";
    const connectDB = require("../src/db/db");

    stage = "loading_app_module";
    const app = require("../src/app");

    stage = "connecting_db";
    connectDB();

    module.exports = app;
} catch (error) {
    console.error(`CRITICAL ERROR AT STAGE: ${stage}`, error);
    module.exports = (req, res) => {
        res.status(500).json({
            message: "Backend Startup Crash",
            failed_stage: stage,
            error: error.message,
            code: error.code,
            stack: error.stack
        });
    };
}
