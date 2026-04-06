const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    // Find current user from verified Firebase uid
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Allow only admin users
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Failed to verify admin access" });
  }
};

module.exports = adminAuth;