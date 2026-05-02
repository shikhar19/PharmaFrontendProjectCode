import React, { useState } from "react";
import { saleService } from "../../services/saleService";

export default function SaleForm({ medicine, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    quantitySold: "",
    customerName: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!medicine) return null;

  const maxQty = medicine.quantity;
  const total =
    formData.quantitySold
      ? (Number(formData.quantitySold) * Number(medicine.price)).toFixed(2)
      : "0.00";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const qty = parseInt(formData.quantitySold, 10);

    if (!qty || qty <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }
    if (qty > maxQty) {
      setError(`Only ${maxQty} units available in stock.`);
      return;
    }

    setSubmitting(true);
    try {
      const saleRecord = await saleService.create({
        medicineId: medicine.id,
        quantitySold: qty,
        customerName: formData.customerName.trim(),
      });
      onSuccess(saleRecord);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to record sale. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sale-form">
      {/* Medicine Info */}
      <div className="sale-medicine-info">
        <div className="sale-info-row">
          <span className="sale-label">Medicine:</span>
          <span className="sale-value">{medicine.fullName}</span>
        </div>
        <div className="sale-info-row">
          <span className="sale-label">Brand:</span>
          <span className="sale-value">{medicine.brand}</span>
        </div>
        <div className="sale-info-row">
          <span className="sale-label">Price per Unit:</span>
          <span className="sale-value">${Number(medicine.price).toFixed(2)}</span>
        </div>
        <div className="sale-info-row">
          <span className="sale-label">Available Stock:</span>
          <span className={`sale-value ${maxQty < 10 ? "text-warning" : "text-success"}`}>
            {maxQty} units
          </span>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="form-group">
        <label htmlFor="quantitySold">Quantity to Sell *</label>
        <input
          id="quantitySold"
          name="quantitySold"
          type="number"
          min="1"
          max={maxQty}
          value={formData.quantitySold}
          onChange={handleChange}
          placeholder={`Max: ${maxQty}`}
          className={error ? "input-error" : ""}
        />
      </div>

      {/* Customer Name */}
      <div className="form-group">
        <label htmlFor="customerName">Customer Name</label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>

      {/* Total Preview */}
      <div className="sale-total">
        <span>Total Amount:</span>
        <strong>${total}</strong>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || maxQty === 0}
        >
          {submitting ? "Processing..." : "Confirm Sale"}
        </button>
      </div>
    </form>
  );
}