import React from "react";
import { FaTrash } from "react-icons/fa";
import "./CartItemCard.css";

const CartItemCard = ({ item, onInc, onDec, onDelete }) => {
  const quantity = item.quantity || 0;
  const points = item.voucher_id?.points || 0;

  return (
    <div className="cart-item">
      <span className="voucher-name">{item.voucher_id?.title || "Unknown"}</span>
      <div className="quantity-controls">
        <button onClick={() => onDec(item)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => onInc(item)}>+</button>
      </div>
      <span className="points">{quantity * points} points </span>
      <FaTrash className="delete-icon" onClick={() => onDelete(item)} />
    </div>
  );
};

export default CartItemCard;