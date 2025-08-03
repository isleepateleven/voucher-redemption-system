const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  redeemCart 
} = require("../controllers/cartController");

router.get("/:uid", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

// Redeem cart items
router.post("/redeem", redeemCart); 

module.exports = router;