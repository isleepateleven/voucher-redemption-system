import React from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { confirmDialog } from "primereact/confirmdialog";

import { addToCart } from "../services/cartService";
import { redeemVoucher } from "../services/redeemService";

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

  const infoTextClass = "mb-2 text-sm leading-[1.4] text-[#444]";
  const modalButtonClass =
    "flex-1 rounded-full border-none px-5 py-[0.9rem] text-sm font-semibold transition-all duration-200";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[500px] rounded-2xl bg-white px-8 py-6 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
     <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[1.2rem] font-semibold text-[#222]">
          {voucher.title}
        </h2>

         <button
            onClick={onClose}
            className="text-3xl font-light leading-none text-[#555] transition hover:text-black"
          >
          &times;
        </button>
      </div>

        <img
          src={voucher.image}
          alt={voucher.title}
          className="mb-4 max-h-[200px] w-full object-cover"
        />

        <p className={infoTextClass}>{voucher.description}</p>

        <p className={infoTextClass}>
          <strong>Points:</strong> {voucher.points}
        </p>

        <p className={infoTextClass}>
          <strong>Terms:</strong> {voucher.terms_and_conditions}
        </p>

        <p className={infoTextClass}>
          <strong>Limit:</strong> {voucher.limit}
        </p>

        <p className={infoTextClass}>
          <strong>Expires:</strong>{" "}
          {new Date(voucher.expiryDate).toLocaleDateString()}
        </p>

        <div className="mb-0 mt-[1.2rem] flex gap-4">
          {isExpired ? (
            <div
              className={`${modalButtonClass} cursor-default select-none bg-[#ccc] text-center text-[#666]`}
            >
              Expired
            </div>
          ) : isDepleted ? (
            <div
              className={`${modalButtonClass} cursor-default select-none bg-[#ccc] text-center text-[#666]`}
            >
              Out of Stock
            </div>
          ) : (
            <>
              <button
                className={`${modalButtonClass} cursor-pointer bg-[#f1f1f1] text-[#333] hover:-translate-y-px hover:bg-[#e0e0e0]`}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                className={`${modalButtonClass} cursor-pointer bg-[#665290] text-white hover:-translate-y-px hover:bg-[#9986d0]`}
                onClick={confirmRedeem}
              >
                Redeem
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;