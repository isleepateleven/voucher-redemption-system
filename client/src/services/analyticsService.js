const API = "http://localhost:5001/api/analytics";

export const getAnalyticsData = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to load analytics");
  return await res.json();
};