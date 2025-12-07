const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const {
  authFoodPartnerMiddleware,
  authUserMiddleware,
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
module.exports = router;
