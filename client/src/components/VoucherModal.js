import React from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { confirmDialog } from "primereact/confirmdialog";

import { addToCart } from "../services/cartService";
import { redeemVoucher } from "../services/redeemService";
import "./VoucherModal.css";

const VoucherModal = ({ voucher, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // if no voucher is selected, do not render modal
  if (!voucher) return null;

  const now = new Date();
  const expiry = new Date(voucher.expiryDate);
  const isExpired = expiry < now;
  const isDepleted = voucher.redeemedCount >= voucher.limit;

  // Add voucher to cart
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
      await addToCart({
        user_id: user.uid,
        voucher_id: voucher._id,
        quantity: 1,
      });

      showToast({
        severity: "success",
        summary: "Added to Cart",
        detail: `${voucher.title} added to cart.`,
      });
    } catch (error) {
      showToast({
        severity: "error",
        summary: "Add Failed",
        detail: error.message || "Failed to add to cart.",
      });
    }
  };

  // Redeem voucher after confirmation
  const handleRedeem = async () => {
    if (!user?.uid) return;

    try {
      await redeemVoucher({
        user_id: user.uid,
        voucher_id: voucher._id,
        quantity: 1,
      });

      showToast({
        severity: "success",
        summary: "Redemption Successful",
        detail: "Your voucher has been redeemed.",
      });
    } catch (error) {
      showToast({
        severity: "error",
        summary: "Redeem Failed",
        detail: error.message || "Unable to redeem voucher.",
      });
    }
  };

  // Show confirm dialog before redeeming
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
    <div className="voucher-modal-overlay" onClick={onClose}>
      <div className="voucher-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={voucher.image} alt={voucher.title} className="voucher-modal-image" />

        <h2 className="voucher-modal-title">{voucher.title}</h2>
        <p className="voucher-modal-description">{voucher.description}</p>
        <p className="voucher-modal-points"><strong>Points:</strong> {voucher.points}</p>
        <p className="voucher-modal-terms"><strong>Terms:</strong> {voucher.terms_and_conditions}</p>
        <p className="voucher-modal-limit"><strong>Limit:</strong> {voucher.limit}</p>
        <p className="voucher-modal-expiry"><strong>Expires:</strong> {new Date(voucher.expiryDate).toLocaleDateString()}</p>

        <div className="voucher-modal-actions">
          {isExpired ? (
            <div className="voucher-modal-btn expired-placeholder">Expired</div>
          ) : isDepleted ? (
            <div className="voucher-modal-btn expired-placeholder">Out of Stock</div>
          ) : (
            <>
              <button className="voucher-modal-btn cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="voucher-modal-btn redeem" onClick={confirmRedeem}>
                Redeem
              </button>
            </>
          )}
        </div>

        <button className="voucher-modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default VoucherModal;