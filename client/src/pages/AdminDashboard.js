import React, { useState } from "react";
import Navbar from "../components/Navbar";
import VoucherManagement from "./tabs/VoucherManagement";
import UserManagement from "./tabs/UserManagement";
import Analytics from "./tabs/Analytics";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("vouchers");

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <h2 className="admin-title">Admin Dashboard</h2>
        <div className="tab-switcher">
          <button
            className={`tab-button ${activeTab === "vouchers" ? "active" : ""}`}
            onClick={() => setActiveTab("vouchers")}
          >
            Vouchers
          </button>
          <button
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        {activeTab === "vouchers" && <VoucherManagement />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </>
  );
};

export default AdminDashboard;