const Voucher = require("../models/Voucher");
 
// Get all vouchers
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// CREATE a new voucher
exports.createVoucher = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      points,
      category_id,
      terms_and_conditions,
      limit,
      expiryDate,
    } = req.body;

    const voucher = new Voucher({
      title,
      description,
      image,
      points,
      category_id,
      terms_and_conditions,
      limit,
      expiryDate,
      is_latest: true,
    });

    const saved = await voucher.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE an existing voucher
exports.updateVoucher = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      points,
      category_id,
      terms_and_conditions,
      limit,
      expiryDate,
    } = req.body;

    const updated = await Voucher.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
        points,
        category_id,
        terms_and_conditions,
        limit,
        expiryDate,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};