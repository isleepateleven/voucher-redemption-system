import React, { useContext, createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);             // Firebase user
  const [userProfile, setUserProfile] = useState(null); // MongoDB user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const token = await currentUser.getIdToken();
          localStorage.setItem("token", token); // ✅ Store Firebase token

          // Sync user to MongoDB if not exists
          await fetch("http://localhost:5001/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // not required for POST /users but safe
            },
            body: JSON.stringify({
              uid: currentUser.uid,
              email: currentUser.email,
            }),
          });

          // Fetch MongoDB profile with user data
          const res = await fetch(`http://localhost:5001/api/users/${currentUser.uid}`);
          const data = await res.json();
          setUserProfile(data);
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

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);