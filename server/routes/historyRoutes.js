// server/routes/historyRoutes.js
const express = require("express");
const router = express.Router();
const {
  getRedeemedVouchers,
} = require("../controllers/historyController");

router.get("/:uid/redeemed", getRedeemedVouchers);

module.exports = router;