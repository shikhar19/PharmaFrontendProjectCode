import React, { useState, useEffect } from "react";
import { saleService } from "../../services/saleService";

export default function SalesList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const data = await saleService.getAll();
        setSales(data);
      } catch (err) {
        setError("Failed to load sales records.");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Compute total revenue
  const totalRevenue = sales
    .reduce((sum, s) => sum + Number(s.totalAmount), 0)
    .toFixed(2);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Sales Records</h1>
      </div>

      {/* Summary Cards */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-number">{sales.length}</span>
          <span className="stat-label">Total Transactions</span>
        </div>
        <div className="stat-card stat-green">
          <span className="stat-number">${totalRevenue}</span>
          <span className="stat-label">Total Revenue</span>
        </div>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading sales...</p>
        </div>
      ) : sales.length === 0 ? (
        <div className="empty-state">
          <p>📋 No sales records yet.</p>
          <p>Go to Medicines and click "Sell" to record a sale.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="medicine-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Customer</th>
                <th>Qty Sold</th>
                <th>Price/Unit</th>
                <th>Total Amount</th>
                <th>Sale Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={sale.id} className="medicine-row">
                  <td>{index + 1}</td>
                  <td><strong>{sale.medicineName}</strong></td>
                  <td>{sale.customerName || <em className="text-muted">—</em>}</td>
                  <td className="td-qty">{sale.quantitySold}</td>
                  <td>${Number(sale.pricePerUnit).toFixed(2)}</td>
                  <td className="td-price">
                    <strong>${Number(sale.totalAmount).toFixed(2)}</strong>
                  </td>
                  <td>
                    {new Date(sale.saleDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}