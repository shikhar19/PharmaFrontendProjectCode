import React from "react";

/**
 * Determine the row background color based on business rules:
 * - Red   : expiry date < 30 days
 * - Yellow: quantity < 10
 * - Red takes priority when both conditions are true
 */
function getRowClass(medicine) {
  const today = new Date();
  const expiry = new Date(medicine.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry <= 30) return "row-red";
  if (medicine.quantity < 10) return "row-yellow";
  return "";
}

function getStatusBadge(medicine) {
  const today = new Date();
  const expiry = new Date(medicine.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry <= 0) return <span className="badge badge-danger">Expired</span>;
  if (daysUntilExpiry <= 30)
    return <span className="badge badge-warning">Expires in {daysUntilExpiry}d</span>;
  if (medicine.quantity < 10)
    return <span className="badge badge-low-stock">Low Stock</span>;
  return <span className="badge badge-ok">In Stock</span>;
}

export default function MedicineRow({ medicine, index, onEdit, onDelete, onSale }) {
  const rowClass = getRowClass(medicine);

  const formattedExpiry = new Date(medicine.expiryDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedPrice = `$${Number(medicine.price).toFixed(2)}`;

  return (
    <tr className={`medicine-row ${rowClass}`}>
      <td className="td-index">{index}</td>
      <td className="td-name">
        <strong>{medicine.fullName}</strong>
      </td>
      <td>{medicine.brand}</td>
      <td>{formattedExpiry}</td>
      <td className="td-qty">{medicine.quantity}</td>
      <td className="td-price">{formattedPrice}</td>
      <td>{getStatusBadge(medicine)}</td>
      <td className="td-actions">
        <button
          className="btn btn-sm btn-sale"
          onClick={onSale}
          title="Record Sale"
          disabled={medicine.quantity === 0}
        >
          🛒 Sell
        </button>
        <button
          className="btn btn-sm btn-edit"
          onClick={onEdit}
          title="Edit Medicine"
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-sm btn-delete"
          onClick={onDelete}
          title="Delete Medicine"
        >
          🗑️ Delete
        </button>
      </td>
    </tr>
  );
}