const userModel = require("../models/user.model");
const FoodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, contactName, phone, address } = req.body;

    // Check if food partner already exists
    const existingPartner = await FoodPartnerModel.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({ message: "Food partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newFoodPartner = new FoodPartnerModel({
      name,
      email,
      password: hashedPassword,
      contactName,
      phone,
      address,
    });

    const token = jwt.sign({ id: newFoodPartner._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'lax'
    });

    await newFoodPartner.save();
    res.status(201).json({
      message: "Food partner registered successfully",
      token: token,
      foodPartner: {
        id: newFoodPartner._id,
        name: newFoodPartner.name,
        email: newFoodPartner.email,
        contactName: newFoodPartner.contactName,
        phone: newFoodPartner.phone,
        address: newFoodPartner.address,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

async function loginFoodPartner(req, res) {
  // Similar to loginUser but for FoodPartnerModel
  const { email, password } = req.body;
  try {
    const partner = await FoodPartnerModel.findOne({ email });
    if (!partner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, partner.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'lax'
    });
    res.status(200).json({
      message: "Login successful",
      token: token,
      foodPartner: {
        id: partner._id,
        name: partner.name,
        email: partner.email,
        restaurantName: partner.restaurantName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

async function getFoodPartnerProfile(req, res) {
  try {
    const foodPartner = req.foodPartner;
    res.status(200).json({
      foodPartner: {
        id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
        address: foodPartner.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getFoodPartnerProfile,
};
