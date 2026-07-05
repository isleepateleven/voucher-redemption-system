import React from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { confirmDialog } from "primereact/confirmdialog";

import { addToCart } from "../services/cartService";
import { redeemVoucher } from "../services/redeemService";

const VoucherCard = ({ voucher, onClick }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

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

  const buttonBaseClass =
    "min-w-[100px] flex-1 rounded-full border-none px-3 py-[0.6rem] text-center text-xs font-semibold transition-all duration-200";

  return (
    <div
      className="m-2 flex h-[270px] w-[260px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-1"
      onClick={onClick}
    >
      <img
        src={voucher.image}
        alt={voucher.title}
        className="h-[140px] w-full object-cover"
      />

      <div className="box-border flex max-w-full flex-1 flex-col px-4 py-3">
        <h4 className="my-[0.2rem] line-clamp-1 max-w-full break-words text-[16px] font-semibold leading-[1.2] text-[#222]">
          {voucher.title}
        </h4>

        <p className="mb-4 line-clamp-2 h-[2.4em] max-w-full overflow-hidden text-xs leading-[1.2] text-[#666]">
          {voucher.description}
        </p>

        <div className="mt-auto flex gap-3">
          {isExpired ? (
            <div
              className={`${buttonBaseClass} cursor-default select-none bg-[#ccc] text-[#666]`}
            >
              Expired
            </div>
          ) : isDepleted ? (
            <div
              className={`${buttonBaseClass} cursor-default select-none bg-[#ccc] text-[#666]`}
            >
              Out of Stock
            </div>
          ) : (
            <>
              <button
                className={`${buttonBaseClass} cursor-pointer bg-[#f1f1f1] text-[#333] hover:-translate-y-px hover:bg-[#e0e0e0]`}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                className={`${buttonBaseClass} cursor-pointer bg-[#665290] text-white hover:-translate-y-px hover:bg-[#9986d0]`}
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

export default VoucherCard;