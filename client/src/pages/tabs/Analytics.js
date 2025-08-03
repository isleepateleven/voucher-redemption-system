import React, { useEffect, useState } from "react";
import { getAnalyticsData } from "../../services/analyticsService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import "./Analytics.css";

const COLORS = [
  "#d96c32", "#c44569", "#555555", "#3778c2", "#5a7d1c",
  "#5d54a4", "#9c1f1f", "#157a6e", "#6c3483", "#b9770e"
];

const Analytics = () => {
  const [topVouchers, setTopVouchers] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { top5, trend, byCategory } = await getAnalyticsData();
      setTopVouchers(top5);
      setTrendData(trend);
      setCategoryData(byCategory);
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics">
      <div className="chart-section">
        <h3>Top 5 Redeemed Vouchers</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topVouchers}>
              <XAxis dataKey="title" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="redeemedCount" fill="#665290" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-section">
        <h3>Redemption Trends (Daily)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#665290"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-section">
        <h3>Redemption by Category</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={isMobile ? 400 : 350}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="category"
                cx={isMobile ? "50%" : "30%"}
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout={isMobile ? "horizontal" : "vertical"}
                align={isMobile ? "center" : "left"}
                verticalAlign={isMobile ? "bottom" : "middle"}
                wrapperStyle={{
                  marginLeft: isMobile ? "0px" : "40px",
                  marginTop: isMobile ? "20px" : "0px",
                  fontSize: "0.75rem",
                  lineHeight: "1.2rem",
                }}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;