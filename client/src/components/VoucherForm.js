import React, { useState, useEffect } from "react";

import { getAllCategories } from "../services/categoryService";

const VoucherForm = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [points, setPoints] = useState("");
  const [terms, setTerms] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setImage(initialData.image || "");
      setPoints(initialData.points ?? "");
      setTerms(initialData.terms_and_conditions || "");
      setLimit(initialData.limit ?? "");
      setExpiryDate(
        initialData.expiryDate
          ? initialData.expiryDate.slice(0, 10)
          : ""
      );
      setCategory(initialData.category_id?._id || "");
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const voucherData = {
      title,
      description,
      image,
      points,
      terms_and_conditions: terms,
      category_id: category,
      limit,
      expiryDate,
    };

    onSave(voucherData);
  };

  const labelClass =
    "mb-1 block text-sm font-semibold text-[#444]";

  const fieldClass =
    "w-full rounded-md border border-[#d0d0d0] px-3 py-2 text-sm outline-none transition focus:border-[#665290] focus:ring-2 focus:ring-[#665290]/20";

  const buttonClass =
    "flex-1 max-w-[150px] rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-2xl bg-white px-8 py-6 shadow-[0_10px_35px_rgba(0,0,0,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-[1.2rem] font-semibold text-[#333]">
            {initialData ? "Edit Voucher" : "Add Voucher"}
          </h4>

          <button
            onClick={onCancel}
            className="text-3xl font-light leading-none text-[#555] transition hover:text-black"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className={labelClass}>Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${fieldClass} min-h-[90px] resize-y`}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Image URL</label>

            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          {/* Enforce two-column layout */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Points</label>

              <input
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={fieldClass}
                required
              >
                <option value="">Select a category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Terms & Conditions
            </label>

            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className={`${fieldClass} min-h-[90px] resize-y`}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Limit</label>

              <input
                type="number"
                min="0"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Expiry Date
              </label>

              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={fieldClass}
                required
              />
            </div>
          </div>

          {/* Buttons side-by-side */}
          <div className="flex justify-end gap-4 pt-3">
            <button
              type="button"
              onClick={onCancel}
              className={`${buttonClass} bg-[#f3f3f3] text-[#555] hover:bg-[#e4e4e4]`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`${buttonClass} bg-[#5e4596] text-white hover:bg-[#7e6bcf]`}
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherForm;