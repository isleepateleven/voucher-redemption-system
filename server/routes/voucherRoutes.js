const express = require("express");
const router = express.Router();
const Voucher = require("../models/Voucher");

// GET /api/vouchers?category_id=...
router.get("/", async (req, res) => {
  try {
    const { category_id } = req.query;
    const filter = category_id ? { category_id } : {};

    const vouchers = await Voucher.find(filter)
      .populate("category_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(vouchers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vouchers", error: err.message });
  }
});

// POST /api/vouchers
router.post("/", async (req, res) => {
  try {
    const newVoucher = new Voucher(req.body);
    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (err) {
    res.status(400).json({ message: "Failed to create voucher", error: err.message });
  }
});

// PUT /api/vouchers/:id
router.put("/:id", async (req, res) => {
  // console.log("Update requested for ID:", req.params.id);
  // console.log("Payload:", req.body);

  try {
    const updated = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      console.log("Voucher not found!");
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/vouchers/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Voucher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Voucher not found" });
    res.json({ message: "Voucher deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;