const foodmodel = require("../models/food.model");
const { uploadFileToImageKit } = require("../services/storage.services");
// ALTERNATIVE: Use local storage to preserve audio
// const { uploadFileLocally } = require("../services/local-storage.services");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  try {
    // Using ImageKit (may strip audio)
    const fileUploadResult = await uploadFileToImageKit(
      req.file.buffer,
      uuid()
    );

    // ALTERNATIVE: Use local storage (preserves audio)
    // const fileUploadResult = await uploadFileLocally(req.file.buffer, uuid());

    const foodItem = await foodmodel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      video: fileUploadResult.url,
      foodpartner: req.foodPartner._id,
    });
    return res.status(201).json({
      message: "Food item created successfully",
      foodItem,
    });
  } catch (error) {
    console.error("Error creating food:", error);
    return res.status(500).json({
      message: "Error creating food item",
      error: error.message,
    });
  }
}
async function getFoods(req, res) {
  const foods = await foodmodel.find();
  return res.status(200).json({
    foods,
  });
}

async function getFoodsByPartnerId(req, res) {
  try {
    const { id } = req.params;
    const foods = await foodmodel.find({ foodpartner: id });
    return res.status(200).json({
      foods,
    });
  } catch (error) {
    console.error("Error fetching foods by partner:", error);
    return res.status(500).json({
      message: "Error fetching foods",
      error: error.message,
    });
  }
}

async function deleteFood(req, res) {
  try {
    const { id } = req.params;
    const food = await foodmodel.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Check if the food belongs to the authenticated partner
    if (food.foodpartner.toString() !== req.foodPartner._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this item" });
    }

    await foodmodel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    return res.status(500).json({
      message: "Error deleting food item",
      error: error.message,
    });
  }
}

module.exports = { createFood, getFoods, getFoodsByPartnerId, deleteFood };
