// const API = "http://localhost:5001/api/vouchers";
const API = `${process.env.REACT_APP_API_URL}/vouchers`;

// Get Firebase token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found in localStorage");
  return token;
};

// Attach Firebase token to protected requests
const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get all vouchers (public)
export const getAllVouchers = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch vouchers");
  }

  return await res.json();
};

// Create a new voucher (admin only)
export const createVoucher = async (data) => {
  const res = await fetch(API, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create voucher");
  }

  return await res.json();
};

// Update an existing voucher (admin only)
export const updateVoucher = async (id, data) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update voucher");
  }

  return await res.json();
};

// Delete a voucher (admin only)
export const deleteVoucher = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete voucher");
  }

  return await res.json();
};