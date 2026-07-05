import React from "react";
import { FaTrash } from "react-icons/fa";

const CartItemCard = ({ item, onInc, onDec, onDelete }) => {
  const quantity = item.quantity || 0;
  const points = item.voucher_id?.points || 0;

  return (
    <div className="mb-4 flex w-full items-center justify-between gap-4 rounded-xl border border-[#ddd] bg-white p-4">
      <span className="flex-[2] text-[0.9rem] font-semibold text-[#333]">
        {item.voucher_id?.title || "Unknown"}
      </span>

      <div className="flex flex-1 items-center gap-2">
        <button
          onClick={() => onDec(item)}
          className="cursor-pointer rounded-md border border-[#ccc] bg-[#f8f8f8] px-[0.6rem] py-[0.2rem] text-[0.9rem] transition-colors duration-200 hover:bg-[#ececec]"
        >
          -
        </button>

        <span className="min-w-[20px] text-center text-[0.9rem]">
          {quantity}
        </span>

        <button
          onClick={() => onInc(item)}
          className="cursor-pointer rounded-md border border-[#ccc] bg-[#f8f8f8] px-[0.6rem] py-[0.2rem] text-[0.9rem] transition-colors duration-200 hover:bg-[#ececec]"
        >
          +
        </button>
      </div>

      <span className="flex-1 text-center text-[0.9rem] text-[#333]">
        {quantity * points} points
      </span>

      <FaTrash
        className="cursor-pointer text-[#888] transition-colors duration-200 hover:text-[#d9534f]"
        onClick={() => onDelete(item)}
      />
    </div>
  );
};

export default CartItemCard;