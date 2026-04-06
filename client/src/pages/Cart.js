import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { confirmDialog } from "primereact/confirmdialog";

import Navbar from "../components/Navbar";
import CartItemCard from "../components/CartItemCard";

import {fetchCart, updateQuantity, deleteCartItem } from "../services/cartService";
import {redeemVouchers} from "../services/redeemService";
import "./Cart.css";

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

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h2 className="cart-title">Cart</h2>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is currently empty.</p>
            <button
              className="cart-button browse"
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
            <div className="checkout-bar">
              <span>Total Points: {totalPoints}</span>
              <button className="cart-button checkout" onClick={handleCheckout}>
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