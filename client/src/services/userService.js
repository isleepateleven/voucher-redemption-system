const API = "http://localhost:5001/api/users";

export const syncUserWithBackend = async (firebaseUser) => {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: firebaseUser.displayName || "",
        phoneNumber: firebaseUser.phoneNumber || "",
        profileImage: firebaseUser.photoURL || "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sync user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid, data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found in localStorage");

  const response = await fetch("http://localhost:5001/api/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update profile");
  }

  return await response.json();
};