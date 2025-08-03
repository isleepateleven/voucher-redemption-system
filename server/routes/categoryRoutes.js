const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
});

// POST /api/categories - supports single or multiple category insert
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // Check if it's an array for bulk insert
    if (Array.isArray(data)) {
      const categories = await Category.insertMany(data);
      res.status(201).json(categories);
    } else {
      const category = new Category({ name: data.name });
      await category.save();
      res.status(201).json(category);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;