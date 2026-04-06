const Voucher = require("../models/Voucher");

// Get all vouchers
const getVouchers = async (req, res) => {
  try {
    const { category_id } = req.query;
    const filter = category_id ? { category_id } : {};

    const vouchers = await Voucher.find(filter)
      .populate("category_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(vouchers);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch vouchers",
      error: err.message,
    });
  }
};

// Create a new voucher
const createVoucher = async (req, res) => {
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

    // Required fields
    if (!title || !category_id || points === undefined || limit === undefined || !expiryDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validation
    if (points < 0) {
      return res.status(400).json({ message: "Points cannot be negative" });
    }

    if (limit < 0) {
      return res.status(400).json({ message: "Limit cannot be negative" });
    }

    // Basic image URL validation
    if (image) {
      try {
        new URL(image);
      } catch {
        return res.status(400).json({ message: "Invalid image URL" });
      }

      // if (!image.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)) {
      //   return res.status(400).json({
      //     message: "Image must be jpg, jpeg, png, or webp",
      //   });
      // }
    }

    const savedVoucher = await voucher.save();
    res.status(201).json(savedVoucher);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create voucher",
      error: err.message,
    });
  }
};

// Update an existing voucher
const updateVoucher = async (req, res) => {
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

    if (!title || !category_id || points === undefined || limit === undefined || !expiryDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (points < 0) {
      return res.status(400).json({ message: "Points cannot be negative" });
    }

    if (limit < 0) {
      return res.status(400).json({ message: "Limit cannot be negative" });
    }

    // Basic image URL validation
    if (image) {
      try {
        new URL(image);
      } catch {
        return res.status(400).json({ message: "Invalid image URL" });
      }

      // if (!image.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)) {
      //   return res.status(400).json({
      //     message: "Image must be jpg, jpeg, png, or webp",
      //   });
      // }
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(
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

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json(updatedVoucher);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update voucher",
      error: err.message,
    });
  }
};

// Delete a voucher
const deleteVoucher = async (req, res) => {
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);

    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json({ message: "Voucher deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete voucher",
      error: err.message,
    });
  }
};

module.exports = {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};