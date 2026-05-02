import React, { useState, useEffect, useCallback } from "react";
import { medicineService } from "../../services/medicineService";
import MedicineRow from "./MedicineRow";
import MedicineForm from "./MedicineForm";
import MedicineSearch from "./MedicineSearch";
import SaleForm from "../Sales/SaleForm";
import Modal from "../common/Modal";

// ─── Legend Component ────────────────────────────────────────────────────────

function ColorLegend() {
  return (
    <div className="legend">
      <span className="legend-title">Color Guide:</span>
      <span className="legend-item legend-red">⬛ Expires within 30 days</span>
      <span className="legend-item legend-yellow">⬛ Stock less than 10</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // ─── Data Fetching ─────────────────────────────────────────────────────────

  const fetchMedicines = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicineService.getAll(query);
      setMedicines(data);
    } catch (err) {
      setError("Failed to load medicines. Please check if the API is running.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedicines(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchMedicines]);

  // ─── Toast Helper ──────────────────────────────────────────────────────────

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── CRUD Handlers ─────────────────────────────────────────────────────────

  const handleAddMedicine = async (formData) => {
    try {
      await medicineService.create(formData);
      showToast("✅ Medicine added successfully!");
      setShowAddModal(false);
      fetchMedicines(searchQuery);
    } catch (err) {
      showToast("❌ Failed to add medicine.", "error");
    }
  };

  const handleEditMedicine = async (formData) => {
    try {
      await medicineService.update(selectedMedicine.id, formData);
      showToast("✅ Medicine updated successfully!");
      setShowEditModal(false);
      setSelectedMedicine(null);
      fetchMedicines(searchQuery);
    } catch (err) {
      showToast("❌ Failed to update medicine.", "error");
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?"))
      return;

    try {
      await medicineService.delete(id);
      showToast("✅ Medicine deleted successfully!");
      fetchMedicines(searchQuery);
    } catch (err) {
      showToast("❌ Failed to delete medicine.", "error");
    }
  };

  const handleRecordSale = async (saleData) => {
    showToast("✅ Sale recorded successfully!");
    setShowSaleModal(false);
    setSelectedMedicine(null);
    // Refresh to update quantities
    fetchMedicines(searchQuery);
  };

  // ─── Modal Openers ─────────────────────────────────────────────────────────

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setShowEditModal(true);
  };

  const openSaleModal = (medicine) => {
    setSelectedMedicine(medicine);
    setShowSaleModal(true);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Medicine Inventory</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Medicine
        </button>
      </div>

      {/* Search + Legend Row */}
      <div className="controls-row">
        <MedicineSearch value={searchQuery} onChange={setSearchQuery} />
        <ColorLegend />
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-number">{medicines.length}</span>
          <span className="stat-label">Total Medicines</span>
        </div>
        <div className="stat-card stat-red">
          <span className="stat-number">
            {medicines.filter((m) => {
              const daysLeft = Math.ceil(
                (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
              );
              return daysLeft <= 30;
            }).length}
          </span>
          <span className="stat-label">Expiring Soon</span>
        </div>
        <div className="stat-card stat-yellow">
          <span className="stat-number">
            {medicines.filter((m) => m.quantity < 10).length}
          </span>
          <span className="stat-label">Low Stock</span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => fetchMedicines(searchQuery)}>Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading medicines...</p>
        </div>
      ) : (
        <>
          {/* Medicine Grid Table */}
          {medicines.length === 0 ? (
            <div className="empty-state">
              <p>🔍 No medicines found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
              {searchQuery && (
                <button className="btn btn-secondary" onClick={() => setSearchQuery("")}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="medicine-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Brand</th>
                    <th>Expiry Date</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine, index) => (
                    <MedicineRow
                      key={medicine.id}
                      medicine={medicine}
                      index={index + 1}
                      onEdit={() => openEditModal(medicine)}
                      onDelete={() => handleDeleteMedicine(medicine.id)}
                      onSale={() => openSaleModal(medicine)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add Medicine Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Medicine"
      >
        <MedicineForm onSubmit={handleAddMedicine} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Medicine Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedMedicine(null); }}
        title="Edit Medicine"
      >
        <MedicineForm
          initialData={selectedMedicine}
          onSubmit={handleEditMedicine}
          onCancel={() => { setShowEditModal(false); setSelectedMedicine(null); }}
        />
      </Modal>

      {/* Record Sale Modal */}
      <Modal
        isOpen={showSaleModal}
        onClose={() => { setShowSaleModal(false); setSelectedMedicine(null); }}
        title={`Record Sale — ${selectedMedicine?.fullName || ""}`}
      >
        <SaleForm
          medicine={selectedMedicine}
          onSuccess={handleRecordSale}
          onCancel={() => { setShowSaleModal(false); setSelectedMedicine(null); }}
        />
      </Modal>
    </div>
  );
}