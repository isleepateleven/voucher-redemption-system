const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, 
  email: { type: String, required: true, unique: true },
  username: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  points: { type: Number, default: 1000 }, 
  address: { type: String, default: "" },
  aboutMe: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
