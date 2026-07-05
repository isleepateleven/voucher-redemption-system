import React, { useState } from "react";

import Navbar from "../components/Navbar";
import VoucherManagement from "./tabs/VoucherManagement";
import UserManagement from "./tabs/UserManagement";
import Analytics from "./tabs/Analytics";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("vouchers");

  const tabButtonClass = (tab) =>
    `relative mr-4 cursor-pointer border-none bg-transparent px-[1.2rem] py-2 text-[0.85rem] hover:text-black ${
      activeTab === tab
        ? "font-semibold text-[#111] after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-full after:rounded-t-sm after:bg-[#111] after:content-['']"
        : "font-medium text-[#555]"
    }`;

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] flex-col bg-[#f7f7fb] px-8 pb-12 pt-4">
        <h2 className="mb-6 mt-2 text-xl font-bold text-[#333]">
          Admin Dashboard
        </h2>

        <div className="flex border-b border-[#ddd]">
          <button
            className={tabButtonClass("vouchers")}
            onClick={() => setActiveTab("vouchers")}
          >
            Vouchers
          </button>

          <button
            className={tabButtonClass("users")}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            className={tabButtonClass("analytics")}
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