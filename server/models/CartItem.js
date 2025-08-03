const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  voucher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher", required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model("CartItem", cartItemSchema);