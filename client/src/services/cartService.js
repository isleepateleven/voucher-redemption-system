// const API = "http://localhost:5001/api/cart";
const API = `${process.env.REACT_APP_API_URL}/cart`;

// Get current user's cart
export const fetchCart = (uid) =>
  fetch(`${API}/${uid}`).then((res) => res.json());

// Add voucher to cart
export const addToCart = async (data) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: data.user_id,
      voucher_id: data.voucher_id,
      quantity: Number(data.quantity) || 1,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Add to cart failed");
  }

  return await res.json();
};

// Update cart item quantity
export const updateQuantity = async (id, quantity) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Failed to update quantity");
  }

  return await res.json();
};

// Delete cart item
export const deleteCartItem = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Failed to delete cart item");
  }

  return await res.json();
};