import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import VoucherCard from "../components/VoucherCard";
import VoucherModal from "../components/VoucherModal";
import Navbar from "../components/Navbar";
import { addToCart } from "../services/cartService";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [points, setPoints] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Fetch all vouchers and categories
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/vouchers");
        const data = await res.json();
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

  // Fetch user points
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!user?.uid) return;

      try {
        const res = await fetch(`http://localhost:5001/api/users/${user.uid}`);
        const data = await res.json();
        setPoints(data.points || 0);
      } catch (err) {
        console.error("Error fetching user points:", err);
      }
    };

    fetchUserPoints();
  }, [user]);

  // Filter vouchers by category
  const filteredVouchers =
    activeCategory === "All"
      ? vouchers
      : vouchers.filter((v) => v.category_id?.name === activeCategory);

  // Add to cart handler
  const handleAddToCart = async (voucher) => {
    if (!user?.uid || !voucher?._id || !voucher?.title) {
      showToast({
        severity: "error",
        summary: "Add to Cart Failed",
        detail: "Missing user or voucher details.",
      });
      return;
    }

    const data = {
      user_id: user.uid,
      voucher_id: voucher._id,
      quantity: 1,
    };

    try {
      await addToCart(data);
      showToast({
        severity: "success",
        summary: "Added to Cart",
        detail: `${voucher.title} has been added to your cart.`,
      });
    } catch (err) {
      console.error("Add to cart failed:", err);
      showToast({
        severity: "error",
        summary: "Add to Cart Failed",
        detail: err.message || "There was an issue adding to cart.",
      });
    }
  };

  // Handle direct redeem
  const handleRedeem = (voucher) => {
    setSelectedVoucher(voucher); // open modal
  };

  return (
    <>
      <Navbar />
      <div className="home-wrapper">
        {/* Banner */}
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
              onAddToCart={handleAddToCart}
              onRedeem={handleRedeem}
            />
          ))}
        </div>

        {/* Voucher Modal */}
        <VoucherModal
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      </div>
    </>
  );
};

export default Home;