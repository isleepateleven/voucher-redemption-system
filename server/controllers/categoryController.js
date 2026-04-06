const Category = require("../models/Category");

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: err.message,
    });
  }
};

module.exports = { getCategories };