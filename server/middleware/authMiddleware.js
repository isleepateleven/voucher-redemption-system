const admin = require("../firebaseAdmin"); // Import the Firebase Admin you set up

const authMiddleware = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // If no token is sent, block the request
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token" });
  }

  try {
    // Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    // If verified, save user info in req.user
    req.user = decodedToken;
    next(); 

  } catch (error) {
    // If token is invalid, block the request
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};

module.exports = authMiddleware;
