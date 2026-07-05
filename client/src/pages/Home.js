import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import VoucherCard from "../components/VoucherCard";
import VoucherModal from "../components/VoucherModal";

import { getAllVouchers } from "../services/voucherService";
import { getUserById } from "../services/userService";

const Home = () => {
  const { user } = useAuth();

  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [points, setPoints] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Load all vouchers and categories
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getAllVouchers();
        setVouchers(data);

        const categoryNames = [
          ...new Set(data.map((v) => v.category_id?.name).filter(Boolean)),
        ];
        setCategories(["All", ...categoryNames]);
      } catch (err) {
        console.error("Error fetching vouchers:", err);
      }
    };

    fetchVouchers();
  }, []);

  // Load current user's points
  useEffect(() => {
    const loadUserPoints = async () => {
      if (!user?.uid) return;

      try {
        const profile = await getUserById(user.uid);
        setPoints(profile.points || 0);
      } catch (err) {
        console.error("Error fetching user points:", err);
      }
    };

    loadUserPoints();
  }, [user]);

  // Filter vouchers by selected category
  const filteredVouchers =
    activeCategory === "All"
      ? vouchers
      : vouchers.filter((v) => v.category_id?.name === activeCategory);

  return (
    <>
      <Navbar />

      <div className="px-10 pb-12 pt-4">
        <div className="mb-4 text-center">
          <h1 className="text-[1.2rem] font-bold text-[#222]">
            Discover Amazing with{" "}
            <span className="text-[#5e4596]">VoucherBank</span>
          </h1>
          <p className="mt-0 text-[0.8rem] text-[#888]">
            Redeem your points for exclusive vouchers and rewards
          </p>
        </div>

        {/* User points */}
        <div className="my-4 flex justify-center">
          <div className="min-w-[220px] rounded-xl bg-white px-8 py-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <span className="mb-1 block text-[0.7rem] text-[#888]">
              Available Points
            </span>
            <span className="text-[1.3rem] font-bold text-[#5e4596]">
              {points.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="mb-2 mt-6 text-base font-semibold text-[#333]">
          Browse by Category
        </div>
        
        <div className="mb-6 mt-4 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer rounded-full border-none px-[0.9rem] py-[0.4rem] text-[0.85rem] ${
                activeCategory === cat
                  ? "bg-[#5e4596] text-white"
                  : "bg-[#e0e0f8] text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vouchers */}
        <div className="mb-2 mt-6 text-base font-semibold text-[#333]">
          {activeCategory === "All"
            ? "All Vouchers"
            : `${activeCategory} Vouchers`}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {filteredVouchers.map((voucher) => (
            <VoucherCard
              key={voucher._id}
              voucher={voucher}
              onClick={() => setSelectedVoucher(voucher)}
            />
          ))}
        </div>
        
        {/* Voucher Details (Voucher Modal) */}
        <VoucherModal
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      </div>
    </>
  );
};

export default Home;