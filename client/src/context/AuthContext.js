import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { syncUserWithBackend, getUserById } from "../services/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Firebase login user
  const [user, setUser] = useState(null);

  // Full user profile from MongoDB
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Listen to Firebase login/logout changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Save Firebase user in state
        setUser(currentUser);

        try {
          // Get Firebase token and store it in browser
          const token = await currentUser.getIdToken();
          localStorage.setItem("token", token);

          // Ensure user exists in backend (create if new, skip if existing)
          await syncUserWithBackend(currentUser, token);

          // Fetch full user profile from backend
          const profile = await getUserById(currentUser.uid);
          setUserProfile(profile);
          
        } catch (err) {
          console.error("Auth sync/fetch failed:", err);
        }
      } else {
        // Clear everything on logout
        setUser(null);
        setUserProfile(null);
        localStorage.removeItem("token");
      }
    });

    // Stop listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);