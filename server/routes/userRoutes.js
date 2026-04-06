const express = require("express");
const router = express.Router();

const {
  getUserById,
  getAllUsers,
  createUser,
  updateUserProfile,
} = require("../controllers/userController");

const firebaseAuth = require("../middleware/firebaseAuth");
const adminAuth = require("../middleware/adminAuth");

// Public: create/sync user after Firebase login
router.post("/", createUser);

// Protected: update current user's profile
router.put("/me", firebaseAuth, updateUserProfile);

// Protected: get current user's profile
router.get("/:uid", firebaseAuth, (req, res, next) => {
  if (req.user.uid !== req.params.uid) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}, getUserById);

// Protected: Get all users (admin only)
router.get("/", firebaseAuth, adminAuth, getAllUsers);

module.exports = router;