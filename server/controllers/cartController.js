const CartItem = require("../models/CartItem");
const CartItemHistory = require('../models/CartItemHistory');

// GET: All cart items for a user
exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ user_id: req.params.uid }).populate("voucher_id");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// POST: Add or increment existing item
exports.addToCart = async (req, res) => {
  const { user_id, voucher_id, quantity } = req.body;

  if (!user_id || !voucher_id) {
    return res.status(400).json({ error: "Missing user_id or voucher_id" });
  }

  try {
    let item = await CartItem.findOne({ user_id, voucher_id });

    if (item) {
      item.quantity += Number(quantity) || 1;
      await item.save();
    } else {
      item = new CartItem({ user_id, voucher_id, quantity: Number(quantity) || 1 });
      await item.save();
    }

    const populatedItem = await item.populate("voucher_id");
    res.status(201).json(populatedItem);
  } catch (err) {
    console.error("❌ Error in addToCart:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// PUT: Update quantity
exports.updateCartItem = async (req, res) => {
  try {
    const updated = await CartItem.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// DELETE: Remove from cart
exports.deleteCartItem = async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cart item" });
  }
};

// POST: Redeem cart items
exports.redeemCart = async (req, res) => {
  const { user_id } = req.body;
  try {
    const cartItems = await CartItem.find({ user_id }).populate('voucher_id');
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const redemptionEntries = cartItems.map(item => ({
      user_id,
      voucher_id: item.voucher_id._id,
      quantity: item.quantity
    }));

    await CartItemHistory.insertMany(redemptionEntries);
    await CartItem.deleteMany({ user_id });

    res.status(200).json({ message: "Redemption successful", redeemed: redemptionEntries });
  } catch (err) {
    res.status(500).json({ message: "Redemption failed", error: err.message });
  }
};