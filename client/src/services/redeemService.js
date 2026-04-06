const API = "http://localhost:5001/api/redeem";

// Redeem one voucher directly
export const redeemVoucher = async (data) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: data.user_id,
      voucher_id: data.voucher_id,
      quantity: Number(data.quantity) || 1,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Redemption failed");
  }

  return await res.json();
};

// Redeem all vouchers from cart
export const redeemVouchers = async (data) => {
  const res = await fetch(`${API}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Redemption failed");
  }

  return await res.json();
};