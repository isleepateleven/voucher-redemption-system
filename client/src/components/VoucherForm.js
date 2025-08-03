import React, { useState, useEffect } from "react";
import "./VoucherForm.css";

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
      setPoints(initialData.points || "");
      setTerms(initialData.terms_and_conditions || "");
      setLimit(initialData.limit || "");
      setExpiryDate(initialData.expiryDate ? initialData.expiryDate.slice(0, 10) : "");

      if (initialData.category_id && typeof initialData.category_id === "object") {
        setCategory(initialData.category_id._id);
      } else {
        setCategory(initialData.category_id || "");
      }
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/categories");
        const data = await res.json();
        setCategories(data);
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

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">{initialData ? "Edit Voucher" : "Add Voucher"}</h4>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="voucher-form">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Image URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} required />

          <div className="form-row">
            <div className="form-col">
              <label>Points</label>
              <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} required />
            </div>
            <div className="form-col">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label>Terms & Conditions</label>
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} />

          <div className="form-row">
            <div className="form-col">
              <label>Limit</label>
              <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} required />
            </div>
            <div className="form-col">
              <label>Expiry Date</label>
              <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            </div>
          </div>

          <div className="form-row form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-save">{initialData ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherForm;