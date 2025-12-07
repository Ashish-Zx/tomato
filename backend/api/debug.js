module.exports = (req, res) => {
    res.status(200).json({
        message: "Vercel Function is WORKING!",
        time: new Date().toISOString(),
        env_check: {
            mongo_exists: !!process.env.MONGO_URI,
            headers: req.headers
        }
    });
};
