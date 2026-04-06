// const API = "http://localhost:5001/api/categories";
const API = `${process.env.REACT_APP_API_URL}/categories`;

// Get all categories (public)
export const getAllCategories = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch categories");
  }

  return await res.json();
};