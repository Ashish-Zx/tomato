module.exports = (req, res) => {
    let appStatus = "Not Loaded";
    try {
        require("../src/app");
        appStatus = "Loaded Successfully";
    } catch (e) {
        appStatus = "Failed: " + e.message;
    }

    res.status(200).json({
        message: "Vercel Function is WORKING!",
        app_integrity: appStatus,
        time: new Date().toISOString(),
        env_check: {
            mongo_exists: !!process.env.MONGO_URI,
            headers: req.headers
        }
    });
};
