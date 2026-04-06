const API = "http://localhost:5001/api/users";

// Get Firebase token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found");
  return token;
};

// Attach Firebase token to protected requests
const getAuthConfig = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Ensure user exists in backend (create if new, return if existing)
export const syncUserWithBackend = async (firebaseUser, token) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to sync user");
  }

  return await res.json();
};

// Get one user profile (protected)
export const getUserById = async (uid) => {
  const res = await fetch(`${API}/${uid}`, {
    method: "GET",
    headers: getAuthConfig().headers,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch user");
  }

  return await res.json();
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const res = await fetch(API, {
    method: "GET",
    headers: getAuthConfig().headers,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch users");
  }

  return await res.json();
};

// Update current logged-in user's profile
export const updateUserProfile = async (data) => {
  const res = await fetch(`${API}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthConfig().headers,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update profile");
  }

  return await res.json();
};