const API = "http://localhost:5001/api/cart";

export const fetchCart = (uid) =>
  fetch(`${API}/${uid}`).then((res) => res.json());

export const addToCart = (data) =>
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: data.user_id,
      voucher_id: data.voucher_id,
      quantity: Number(data.quantity) || 1,
    }),
  }).then((res) => {
    if (!res.ok) throw new Error("Add to cart failed");
    return res.json();
  });

export const updateQuantity = (id, quantity) =>
  fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  }).then((res) => res.json());

export const deleteCartItem = (id) =>
  fetch(`${API}/${id}`, { method: "DELETE" }).then((res) => res.json());