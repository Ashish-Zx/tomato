const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getFoodPartnerProfile,
} = require("../controllers/auth.controller");
const { authFoodPartnerMiddleware } = require("../middlewares/authmiddleware");

//user routes
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);

//food partner routes
router.post("/foodpartner/register", registerFoodPartner);
router.post("/foodpartner/login", loginFoodPartner);
router.get("/foodpartner/logout", logoutFoodPartner);
router.get(
  authFoodPartnerMiddleware,
  getFoodPartnerProfile
);

const { getFoodPartnerImageKitAuth } = require("../controllers/auth.controller");
router.get(
  "/foodpartner/imagekit-auth",
  authFoodPartnerMiddleware,
  getFoodPartnerImageKitAuth
);

module.exports = router;
