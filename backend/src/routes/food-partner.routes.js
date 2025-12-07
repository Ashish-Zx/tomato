const express = require("express");
const router = express.Router();

const { getFoodPartnerById } = require("../controllers/food-partner.controller");

// Public route - no auth needed to view partner profile
router.get("/:id", getFoodPartnerById);

module.exports = router;
