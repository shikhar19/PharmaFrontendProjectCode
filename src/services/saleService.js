import axios from "axios";

const API_BASE = "https://localhost:7285/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ─── Sales API Calls ─────────────────────────────────────────────────────────

export const saleService = {
  /**
   * Fetch all sale records
   */
  getAll: async () => {
    const response = await api.get("/sales");
    return response.data;
  },

  /**
   * Fetch sale records for a specific medicine
   * @param {string} medicineId
   */
  getByMedicine: async (medicineId) => {
    const response = await api.get(`/sales/medicine/${medicineId}`);
    return response.data;
  },

  /**
   * Record a new sale
   * @param {Object} sale - { medicineId, quantitySold, customerName }
   */
  create: async (sale) => {
    const response = await api.post("/sales", sale);
    return response.data;
  },
};