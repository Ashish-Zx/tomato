const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const {
  authFoodPartnerMiddleware,
  authUserMiddleware,
  authEitherMiddleware,
} = require("../middlewares/authmiddleware");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});
// /api/food/ [protected route  ]
router.post(
  "/",
  authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);

//GET //
router.get("/", authUserMiddleware, foodController.getFoods);
router.get(
  "/partner/:id",
  authEitherMiddleware,  // Allow both users and partners
  foodController.getFoodsByPartnerId
);

// DELETE food item
router.delete(
  "/:id",
  authFoodPartnerMiddleware,
  foodController.deleteFood
);

module.exports = router;
