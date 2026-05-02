import React, { useState, useEffect } from "react";

// Default empty form state
const EMPTY_FORM = {
  fullName: "",
  notes: "",
  expiryDate: "",
  quantity: "",
  price: "",
  brand: "",
};

export default function MedicineForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing an existing medicine
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        notes: initialData.notes || "",
        expiryDate: initialData.expiryDate
          ? new Date(initialData.expiryDate).toISOString().split("T")[0]
          : "",
        quantity: initialData.quantity?.toString() || "",
        price: initialData.price?.toString() || "",
        brand: initialData.brand || "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData]);

  // ─── Validation ───────────────────────────────────────────────────────────

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Medicine name is required";
    else if (formData.fullName.trim().length < 3)
      newErrors.fullName = "Name must be at least 3 characters";

    if (!formData.brand.trim())
      newErrors.brand = "Brand is required";

    if (!formData.expiryDate)
      newErrors.expiryDate = "Expiry date is required";

    if (formData.quantity === "" || formData.quantity === null)
      newErrors.quantity = "Quantity is required";
    else if (Number(formData.quantity) < 0)
      newErrors.quantity = "Quantity cannot be negative";

    if (formData.price === "" || formData.price === null)
      newErrors.price = "Price is required";
    else if (Number(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";

    return newErrors;
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        price: parseFloat(Number(formData.price).toFixed(2)),
        expiryDate: new Date(formData.expiryDate).toISOString(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="medicine-form" noValidate>
      {/* Full Name */}
      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. Paracetamol 500mg"
          className={errors.fullName ? "input-error" : ""}
        />
        {errors.fullName && <span className="field-error">{errors.fullName}</span>}
      </div>

      {/* Brand */}
      <div className="form-group">
        <label htmlFor="brand">Brand *</label>
        <input
          id="brand"
          name="brand"
          type="text"
          value={formData.brand}
          onChange={handleChange}
          placeholder="e.g. HealthCare Plus"
          className={errors.brand ? "input-error" : ""}
        />
        {errors.brand && <span className="field-error">{errors.brand}</span>}
      </div>

      {/* Expiry Date */}
      <div className="form-group">
        <label htmlFor="expiryDate">Expiry Date *</label>
        <input
          id="expiryDate"
          name="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={handleChange}
          className={errors.expiryDate ? "input-error" : ""}
        />
        {errors.expiryDate && <span className="field-error">{errors.expiryDate}</span>}
      </div>

      {/* Quantity & Price side by side */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            className={errors.quantity ? "input-error" : ""}
          />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            className={errors.price ? "input-error" : ""}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Optional notes about this medicine..."
        />
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : initialData ? "Update Medicine" : "Add Medicine"}
        </button>
      </div>
    </form>
  );
}