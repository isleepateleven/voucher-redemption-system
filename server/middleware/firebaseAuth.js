const admin = require("../config/firebaseAdmin");

const firebaseAuth = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized, no token" });

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Attach user info to request
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid Firebase token" });
  }
};

module.exports = firebaseAuth;