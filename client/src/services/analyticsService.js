const API = "http://localhost:5001/api/analytics";

// Get analytics data
export const getAnalyticsData = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return await res.json();
};