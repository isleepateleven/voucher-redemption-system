const express = require("express");
const router = express.Router();
const {
  getUserById,
  getAllUsers,
  createUser,
  updateUserProfile,
} = require("../controllers/userController");

const firebaseAuth = require("../middleware/firebaseAuth");
const passportAuth = require("../middleware/passportAuth");

// Public routes
router.post("/", createUser);
router.get("/", getAllUsers);

// Firebase-protected route
router.get("/firebase-profile", firebaseAuth, (req, res) => {
  res.json({ message: "Welcome Firebase user", user: req.user });
});

// Passport-protected route
router.get("/jwt-profile", passportAuth, (req, res) => {
  res.json({ message: "Welcome JWT user", user: req.user });
});

// ✅ FIXED: Use Firebase auth for profile update
router.put("/me", firebaseAuth, updateUserProfile);

// Get a single user by UID
router.get("/:uid", getUserById);

module.exports = router;