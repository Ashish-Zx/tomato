const FoodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id;
    const foodPartner = await FoodPartnerModel.findById(foodPartnerId).select(
      "-password"
    );
    const foods = await foodModel.find({ foodpartner: foodPartnerId });
    foodPartner.foods = foods;
    // Exclude password field
    if (!foodPartner) {
      return res.status(404).json({ message: "Food Partner not found" });
    }
    res.status(200).json({ foodPartner, foods });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getFoodPartnerById };
