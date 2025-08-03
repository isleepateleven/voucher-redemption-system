import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { confirmDialog } from "primereact/confirmdialog";
import CartItemCard from "../components/CartItemCard";
import Navbar from "../components/Navbar";
import {
  fetchCart,
  updateQuantity,
  deleteCartItem,
} from "../services/cartService";
import "./Cart.css";

const Cart = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    fetchCart(user.uid).then(setCart);
  }, [user]);

  const inc = async (item) => {
    const updated = await updateQuantity(item._id, item.quantity + 1);
    setCart((prev) =>
      prev.map((i) =>
        i._id === item._id ? { ...i, quantity: updated.quantity } : i
      )
    );
  };

  const dec = async (item) => {
    if (item.quantity <= 1) return;
    const updated = await updateQuantity(item._id, item.quantity - 1);
    setCart((prev) =>
      prev.map((i) =>
        i._id === item._id ? { ...i, quantity: updated.quantity } : i
      )
    );
  };

  const remove = async (item) => {
    await deleteCartItem(item._id);
    setCart((prev) => prev.filter((i) => i._id !== item._id));
  };

  const totalPoints = cart.reduce((acc, item) => {
    const points = item.voucher_id?.points || 0;
    const quantity = item.quantity || 0;
    return acc + quantity * points;
  }, 0);

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
          const res = await fetch("http://localhost:5001/api/redeem/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.uid,
              items: cart.map((item) => ({
                voucher_id: item.voucher_id?._id,
                quantity: item.quantity,
              })),
            }),
          });

          const data = await res.json();

          if (res.ok) {
            showToast({
              severity: "success",
              summary: "Redemption Successful",
              detail: "Your vouchers have been redeemed.",
            });
            navigate("/redeemed");
          } else {
            showToast({
              severity: "error",
              summary: "Checkout Failed",
              detail: data.error || "Unable to redeem vouchers.",
            });
          }
        } catch (err) {
          showToast({
            severity: "error",
            summary: "Server Error",
            detail: "Something went wrong during checkout.",
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