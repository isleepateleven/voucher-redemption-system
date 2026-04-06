const CartItem = require("../models/CartItem");
const CartItemHistory = require("../models/CartItemHistory");
const User = require("../models/User");
const Voucher = require("../models/Voucher");


// Shared redeem logic used by both single redeem and cart redeem
async function redeemVoucher({ user_id, voucher_id, quantity }) {
  const voucher = await Voucher.findById(voucher_id);
  if (!voucher) throw new Error("Voucher not found");

  if (voucher.expiryDate < new Date()) {
    throw new Error("Voucher has expired");
  }

  if (voucher.redeemedCount + quantity > voucher.limit) {
    throw new Error("Voucher limit reached");
  }

  const totalCost = voucher.points * quantity;

  const user = await User.findOne({ uid: user_id });
  if (!user) throw new Error("User not found");

  // check if user has enough points
  if (user.points < totalCost) throw new Error("Not enough points");

   // deduct user points and update voucher redeemed count
  user.points -= totalCost;
  await user.save();

  // increase redeemed count
  voucher.redeemedCount += quantity;
  await voucher.save();

  // save redeemed voucher into history
  const redeemed = new CartItemHistory({ user_id, voucher_id, quantity });
  await redeemed.save();

  return redeemed;
}

// Redeem one voucher directly
exports.redeemSingleVoucher = async (req, res) => {
  try {
    const { user_id, voucher_id, quantity } = req.body;
    const result = await redeemVoucher({ user_id, voucher_id, quantity }); 
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Redeem multiple vouchers from cart
exports.redeemFromCart = async (req, res) => {
  try {
    const { user_id, items } = req.body;

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: "No vouchers to redeem" });

    const redeemedList = [];
    
    // redeem each voucher in the cart
    for (const item of items) {
      const redeemed = await redeemVoucher({ 
        user_id,
        voucher_id: item.voucher_id,
        quantity: item.quantity,
      });
      redeemedList.push(redeemed);
    }

    // clear cart after successful redemption
    await CartItem.deleteMany({ user_id });

    res.status(200).json({ message: "Redemption successful", redeemedList });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};