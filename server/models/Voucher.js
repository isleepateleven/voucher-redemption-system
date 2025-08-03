const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: String,
  description: String,
  terms_and_conditions: String,
  is_latest: {
    type: Boolean,
    default: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  redeemedCount: {
    type: Number,
    default: 0,
  },
  expiryDate: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Voucher", voucherSchema);