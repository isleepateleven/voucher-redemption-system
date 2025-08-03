import React from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { confirmDialog } from "primereact/confirmdialog";
import "./VoucherCard.css";

const VoucherCard = ({ voucher, onClick }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const now = new Date();
  const expiry = new Date(voucher.expiryDate);
  const isExpired = expiry < now;
  const isDepleted = voucher.redeemedCount >= voucher.limit;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user?.uid) {
      showToast({
        severity: "warn",
        summary: "Not Logged In",
        detail: "Please log in to add to cart.",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.uid, voucher_id: voucher._id }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({
          severity: "success",
          summary: "Added to Cart",
          detail: `${voucher.title} added to cart.`,
        });
      } else {
        showToast({
          severity: "error",
          summary: "Add Failed",
          detail: data.error || "Failed to add to cart.",
        });
      }
    } catch {
      showToast({
        severity: "error",
        summary: "Server Error",
        detail: "Something went wrong. Try again.",
      });
    }
  };

  const handleRedeem = async () => {
    if (!user?.uid) return;

    try {
      const res = await fetch("http://localhost:5001/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.uid,
          voucher_id: voucher._id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({
          severity: "success",
          summary: "Redemption Successful",
          detail: "Your vouchers have been redeemed.",
        });
      } else {
        showToast({
          severity: "error",
          summary: "Redeem Failed",
          detail: data.error || "Unable to redeem voucher.",
        });
      }
    } catch {
      showToast({
        severity: "error",
        summary: "Server Error",
        detail: "Something went wrong during redemption.",
      });
    }
  };

  const confirmRedeem = (e) => {
    e.stopPropagation();

    if (!user?.uid) {
      showToast({
        severity: "warn",
        summary: "Not Logged In",
        detail: "Please log in to redeem.",
      });
      return;
    }

    confirmDialog({
      message: "Are you sure you want to redeem this voucher?",
      header: "Confirm Redemption",
      acceptLabel: "Yes",
      rejectLabel: "No",
      acceptClassName: "p-button-success",
      accept: handleRedeem,
    });
  };

  return (
    <div className="voucher-card" onClick={onClick}>
      <img src={voucher.image} alt={voucher.title} className="voucher-image" />
      <div className="voucher-details">
        <h4 className="voucher-title">{voucher.title}</h4>
        <p className="voucher-description">{voucher.description}</p>

        <div className="voucher-actions">
          {isExpired ? (
            <div className="voucher-button expired-placeholder">Expired</div>
          ) : isDepleted ? (
            <div className="voucher-button expired-placeholder">Out of Stock</div>
          ) : (
            <>
              <button className="voucher-button cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="voucher-button redeem" onClick={confirmRedeem}>
                Redeem
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;