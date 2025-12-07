const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    likedFoods: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    }],
    savedFoods: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    }]
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
