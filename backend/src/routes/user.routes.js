const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authUserMiddleware } = require("../middlewares/authmiddleware");

// All routes require user authentication
router.use(authUserMiddleware);

// Like/unlike food
router.post("/like/:foodId", userController.likeFood);

// Save/unsave food
router.post("/save/:foodId", userController.saveFood);

// Get liked foods
router.get("/liked", userController.getLikedFoods);

// Get saved foods
router.get("/saved", userController.getSavedFoods);

// Get user profile
router.get("/profile", userController.getUserProfile);

// Update user profile
router.put("/profile", userController.updateUserProfile);

module.exports = router;
