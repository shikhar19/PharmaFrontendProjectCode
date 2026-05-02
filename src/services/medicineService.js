import axios from "axios";

// Base URL for the .NET API
const API_BASE = "https://localhost:7285/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ─── Medicine API Calls ──────────────────────────────────────────────────────

export const medicineService = {
  /**
   * Fetch all medicines, optionally filtered by search term
   * @param {string} search - Optional search query
   */
  getAll: async (search = "") => {
    const params = search ? { search } : {};
    const response = await api.get("/medicines", { params });
    return response.data;
  },

  /**
   * Fetch a single medicine by ID
   * @param {string} id
   */
  getById: async (id) => {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },

  /**
   * Create a new medicine
   * @param {Object} medicine
   */
  create: async (medicine) => {
    const response = await api.post("/medicines", medicine);
    return response.data;
  },

  /**
   * Update an existing medicine
   * @param {string} id
   * @param {Object} medicine
   */
  update: async (id, medicine) => {
    const response = await api.put(`/medicines/${id}`, medicine);
    return response.data;
  },

  /**
   * Delete a medicine by ID
   * @param {string} id
   */
  delete: async (id) => {
    await api.delete(`/medicines/${id}`);
  },
};