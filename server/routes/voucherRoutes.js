const express = require("express");
const router = express.Router();

const {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} = require("../controllers/voucherController");

const firebaseAuth = require("../middleware/firebaseAuth");
const adminAuth = require("../middleware/adminAuth");

// Public: get all vouchers
router.get("/", getVouchers);

// Protected: create voucher (admin only)
router.post("/", firebaseAuth, adminAuth, createVoucher);

// Protected: update voucher (admin only)
router.put("/:id", firebaseAuth, adminAuth, updateVoucher);

// Protected: delete voucher (admin only)
router.delete("/:id", firebaseAuth, adminAuth, deleteVoucher);

module.exports = router;