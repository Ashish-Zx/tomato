const userModel = require("../models/user.model");

// Like a food item
async function likeFood(req, res) {
    try {
        const { foodId } = req.params;
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        // Toggle like
        const isLiked = user.likedFoods.includes(foodId);

        if (isLiked) {
            user.likedFoods = user.likedFoods.filter(id => id.toString() !== foodId);
        } else {
            user.likedFoods.push(foodId);
        }

        await user.save();

        return res.status(200).json({
            message: isLiked ? "Food unliked" : "Food liked",
            isLiked: !isLiked,
            likedCount: user.likedFoods.length
        });
    } catch (error) {
        console.error("Error liking food:", error);
        return res.status(500).json({ message: "Error liking food" });
    }
}

// Save a food item
async function saveFood(req, res) {
    try {
        const { foodId } = req.params;
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        // Toggle save
        const isSaved = user.savedFoods.includes(foodId);

        if (isSaved) {
            user.savedFoods = user.savedFoods.filter(id => id.toString() !== foodId);
        } else {
            user.savedFoods.push(foodId);
        }

        await user.save();

        return res.status(200).json({
            message: isSaved ? "Food unsaved" : "Food saved",
            isSaved: !isSaved,
            savedCount: user.savedFoods.length
        });
    } catch (error) {
        console.error("Error saving food:", error);
        return res.status(500).json({ message: "Error saving food" });
    }
}

// Get user's liked foods
async function getLikedFoods(req, res) {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).populate('likedFoods');

        return res.status(200).json({
            foods: user.likedFoods || []
        });
    } catch (error) {
        console.error("Error fetching liked foods:", error);
        return res.status(500).json({ message: "Error fetching liked foods" });
    }
}

// Get user's saved foods
async function getSavedFoods(req, res) {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).populate('savedFoods');

        return res.status(200).json({
            foods: user.savedFoods || []
        });
    } catch (error) {
        console.error("Error fetching saved foods:", error);
        return res.status(500).json({ message: "Error fetching saved foods" });
    }
}

// Get user profile
async function getUserProfile(req, res) {
    try {
        const user = req.user;
        return res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                likedCount: user.likedFoods?.length || 0,
                savedCount: user.savedFoods?.length || 0
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Error fetching profile" });
    }
}

// Update user profile
async function updateUserProfile(req, res) {
    try {
        const userId = req.user._id;
        const { fullName, email } = req.body;

        const user = await userModel.findByIdAndUpdate(
            userId,
            { fullName, email },
            { new: true }
        );

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Error updating profile" });
    }
}

module.exports = {
    likeFood,
    saveFood,
    getLikedFoods,
    getSavedFoods,
    getUserProfile,
    updateUserProfile
};
