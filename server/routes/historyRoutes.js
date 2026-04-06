// server/routes/historyRoutes.js
const express = require("express");
const router = express.Router();
const {
  getRedeemedVouchers,
} = require("../controllers/historyController");

router.get("/:uid", getRedeemedVouchers);

module.exports = router;