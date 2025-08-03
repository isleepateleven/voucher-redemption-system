require("dotenv").config();
const admin = require("firebase-admin"); // Import Firebase Admin SDK

// TEMP: Debug to check if .env is loading the private key
console.log("PRIVATE KEY LOADED:", process.env.FIREBASE_PRIVATE_KEY ? "yes" : " no");


// Create service account credentials from .env
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix line breaks
};

// Initialize Firebase Admin using credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
