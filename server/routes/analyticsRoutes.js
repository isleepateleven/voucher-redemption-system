const express = require("express");
const router = express.Router();

const { getAnalytics } = require("../controllers/analyticsController");
const firebaseAuth = require("../middleware/firebaseAuth");
const adminAuth = require("../middleware/adminAuth");

// Admin only
router.get("/", firebaseAuth, adminAuth, getAnalytics);

module.exports = router;