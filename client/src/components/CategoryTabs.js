import React from "react";
import "./CategoryTabs.css";

const CategoryTabs = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="category-tabs">
      <button
        className={selectedCategory === "all" ? "active" : ""}
        onClick={() => onSelect("all")}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          className={selectedCategory === cat._id ? "active" : ""}
          onClick={() => onSelect(cat._id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;