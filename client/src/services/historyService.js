// const API = "http://localhost:5001/api/history";
const API = `${process.env.REACT_APP_API_URL}/history`;

// Get redeemed voucher history
export const fetchRedeemedHistory = async (uid) => {
  const res = await fetch(`${API}/${uid}`);

  if (!res.ok) {
    throw new Error("Failed to fetch redeemed history");
  }

  return await res.json();
};