import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { confirmDialog } from "primereact/confirmdialog";

import Navbar from "../components/Navbar";
import CartItemCard from "../components/CartItemCard";

import { fetchCart, updateQuantity, deleteCartItem } from "../services/cartService";
import { redeemVouchers } from "../services/redeemService";

const Cart = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  // Load current user's cart
  useEffect(() => {
    if (!user?.uid) return;

    const loadCart = async () => {
      try {
        const data = await fetchCart(user.uid);
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);

        showToast({
          severity: "error",
          summary: "Error",
          detail: "Failed to load cart.",
        });
      }
    };

    loadCart();
  }, [user, showToast]);

  // Increase quantity of one cart item
  const inc = async (item) => {
    const updated = await updateQuantity(item._id, item.quantity + 1);

    // React state must NOT be mutated directly -> so create new array with updated item
    setCart((prev) =>
      prev.map((i) =>
        i._id === item._id ? { ...i, quantity: updated.quantity } : i
      )
    );
  };

  // Decrease quantity of one cart item
  const dec = async (item) => {
    if (item.quantity <= 1) return;
    const updated = await updateQuantity(item._id, item.quantity - 1);
    setCart((prev) =>
      prev.map((i) =>
        i._id === item._id ? { ...i, quantity: updated.quantity } : i
      )
    );
  };

  // Remove one item from cart
  const remove = async (item) => {
    await deleteCartItem(item._id);
    setCart((prev) => prev.filter((i) => i._id !== item._id));
  };

  // Calculate total points for all cart items
  const totalPoints = cart.reduce((acc, item) => {
    const points = item.voucher_id?.points || 0;
    const quantity = item.quantity || 0;
    return acc + quantity * points;
  }, 0);

  // Redeem all vouchers in cart
  const handleCheckout = () => {
    if (!user?.uid || cart.length === 0) return;

    confirmDialog({
      message: "Are you sure you want to redeem all vouchers in your cart?",
      header: "Confirm Redemption",
      acceptLabel: "Yes",
      rejectLabel: "No",
      acceptClassName: "p-button-success",
      accept: async () => {
        try {
          await redeemVouchers({
            user_id: user.uid,
            items: cart.map((item) => ({
              voucher_id: item.voucher_id?._id,
              quantity: item.quantity,
            })),
          });

          showToast({
            severity: "success",
            summary: "Redemption Successful",
            detail: "Your vouchers have been redeemed.",
          });

          navigate("/redeemed");
        } catch (err) {
          showToast({
            severity: "error",
            summary: "Checkout Failed",
            detail: err.message || "Unable to redeem vouchers.",
          });
        }
      },
    });
  };

  const cartButtonClass =
    "min-w-[100px] cursor-pointer rounded-full border-none bg-[#665290] px-5 py-[0.6rem] text-center text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#9986d0]";

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] flex-col bg-[#f7f7fb] px-8 py-4">
        <h2 className="mb-6 mt-2 text-xl font-bold text-[#333]">Cart</h2>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-40 text-center text-[#555]">
            <p className="mb-4 text-[0.95rem]">Your cart is currently empty.</p>
            <button
              className={cartButtonClass}
              onClick={() => navigate("/home")}
            >
              Browse Vouchers
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <CartItemCard
                key={item._id}
                item={item}
                onInc={inc}
                onDec={dec}
                onDelete={remove}
              />
            ))}
            <div className="mt-8 flex items-center justify-between border-t border-[#ddd] pt-4 text-[#333]">
             <span className="text-[15px]">
              <span className="font-semibold">Total Points:</span>{" "}
              <span className="font-semibold text-[#5e4596]">{totalPoints}</span>
            </span>
              <button className={cartButtonClass} onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;