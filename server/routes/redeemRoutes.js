// routes/redeemRoutes.js
const express = require("express");
const router = express.Router();
const {
  redeemSingleVoucher,
  redeemFromCart,
} = require("../controllers/redeemController");

router.post("/", redeemSingleVoucher);       // Redeem Now (single voucher)
router.post("/cart", redeemFromCart);        // Checkout (cart redemption)

module.exports = router;