const foodmodel = require("../models/food.model");
const { uploadFileToImageKit } = require("../services/storage.services");
const { v4uuid } = require("uuid");

async function createFood(req, res) {
  const fileUploadResult = await uploadFileToImageKit(req.file.buffer, uuid());

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
}
async function getFoods(req, res) {
  const foods = await foodmodel.find();
  return res.status(200).json({
    foods,
  });
}
module.exports = { createFood, getFoods };
