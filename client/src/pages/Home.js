import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import Navbar from "../components/Navbar";
import VoucherCard from "../components/VoucherCard";
import VoucherModal from "../components/VoucherModal";

import { getAllVouchers } from "../services/voucherService";
import { getUserById } from "../services/userService";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

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
      <div className="home-wrapper">
        <div className="home-banner">
          <h1>
            Discover Amazing with <span className="highlight">VoucherBank</span>
          </h1>
          <p>Redeem your points for exclusive vouchers and rewards</p>
        </div>

        {/* User points */}
        <div className="summary-center">
          <div className="summary-card single-card">
            <span className="label">Available Points</span>
            <span className="value blue">{points.toLocaleString()}</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="section-title">Browse by Category</div>
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "active" : ""}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vouchers */}
        <div className="section-title">
          {activeCategory === "All"
            ? "All Vouchers"
            : `${activeCategory} Vouchers`}
        </div>

        <div className="voucher-grid">
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