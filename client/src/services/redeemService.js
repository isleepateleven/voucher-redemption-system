export const redeemVouchers = async (user_id, items) => {
  const res = await fetch("http://localhost:5001/api/redeem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id, items }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Redemption failed");
  }

  return res.json();
};