// Import Firebase core and authentication modules
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBRtFRZQD0Kkwwtxfz8ESskUmG71QYcrJw",
  authDomain: "voucher-redemption-bb432.firebaseapp.com",
  projectId: "voucher-redemption-bb432",
  storageBucket: "voucher-redemption-bb432.firebasestorage.app",
  messagingSenderId: "427679262157",
  appId: "1:427679262157:web:b5463e9fe3c4d527129084",
  measurementId: "G-3WBVDV6Y4J"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Auth and Google Provider to be reused in components
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
