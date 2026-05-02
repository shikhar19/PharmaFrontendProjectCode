import React from "react";

export default function MedicineSearch({ value, onChange }) {
  return (
    <div className="search-container">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search by medicine name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange("")}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}