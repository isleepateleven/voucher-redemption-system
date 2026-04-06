const API = "http://localhost:5001/api/categories";

// Get all categories (public)
export const getAllCategories = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch categories");
  }

  return await res.json();
};