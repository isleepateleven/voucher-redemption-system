const CartItemHistory = require("../models/CartItemHistory");
const Voucher = require("../models/Voucher");
const Category = require("../models/Category");

exports.getAnalytics = async (req, res) => {
  try {
    const history = await CartItemHistory.find().populate("voucher_id");

    // --- Top 5 Redeemed Vouchers ---
    const countMap = {};
    history.forEach((h) => {
      const title = h.voucher_id?.title;
      if (title) {
        countMap[title] = (countMap[title] || 0) + h.quantity;
      }
    });

    const top5 = Object.entries(countMap)
      .map(([title, redeemedCount]) => ({ title, redeemedCount }))
      .sort((a, b) => b.redeemedCount - a.redeemedCount)
      .slice(0, 5);

    // --- Redemption Trends (last 7 days) ---
    const trendMap = {};
    history.forEach((h) => {
      const date = new Date(h.completed_date).toISOString().split("T")[0]; // ISO date (yyyy-mm-dd)
      trendMap[date] = (trendMap[date] || 0) + h.quantity;
    });

    let trend = Object.entries(trendMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Only keep the latest 7 days
    trend = trend.slice(-7);

    // --- Redemption by Category ---
    const vouchers = await Voucher.find().populate("category_id");
    const catMap = {};
    for (const v of vouchers) {
      const voucherHistories = history.filter(
        (h) => h.voucher_id?._id.toString() === v._id.toString()
      );
      const total = voucherHistories.reduce((sum, h) => sum + h.quantity, 0);
      const catName = v.category_id?.name || "Uncategorized";
      catMap[catName] = (catMap[catName] || 0) + total;
    }

    const byCategory = Object.entries(catMap).map(([category, count]) => ({
      category,
      count,
    }));

    res.json({ top5, trend, byCategory });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
};