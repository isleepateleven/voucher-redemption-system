const CartItemHistory = require("../models/CartItemHistory");
// const Voucher = require("../models/Voucher");

exports.getRedeemedVouchers = async (req, res) => {
  try {
    const userId = req.params.uid;

    const history = await CartItemHistory
      .find({ user_id: userId })   // Find all redemption records for a user
      .populate("voucher_id");     // Populate voucher details

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch redeemed vouchers" });
  }
};