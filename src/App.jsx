import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import MedicineList from "./components/Medicine/MedicineList.jsx";
import SalesList from "./components/Sales/SalesList.jsx";
import "./App.css";

// ─── Navigation Bar ──────────────────────────────────────────────────────────

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">💊</span>
        <span className="brand-name">ABC Pharmacy</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            🏥 Medicines
          </Link>
        </li>
        <li>
          <Link
            to="/sales"
            className={`nav-link ${location.pathname === "/sales" ? "active" : ""}`}
          >
            🧾 Sales Records
          </Link>
        </li>
      </ul>
    </nav>
  );
}

// ─── App Root ────────────────────────────────────────────────────────────────

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MedicineList />} />
            <Route path="/sales" element={<SalesList />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2024 ABC Pharmacy Management System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;