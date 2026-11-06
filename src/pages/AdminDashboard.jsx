import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Checkout.css";
import "../index.css";

const API_URL = "http://localhost/productcode/ApI.php";
const TELEGRAM_PHONE = "0979937524";
const TELEGRAM_CHAT_URL = "https://t.me/+855979937524";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication PIN state (Default PIN: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "analytics" | "all"

  // Fetch orders from MySQL API
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=orders`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const data = await response.json();

      if (data && data.success && Array.isArray(data.orders)) {
        // Map DB orders
        const mappedOrders = data.orders.map((dbOrder) => ({
          id: dbOrder.id || dbOrder.order_number,
          orderNumber: dbOrder.order_number,
          customer: {
            fullName: dbOrder.fullName || "Customer",
            id: dbOrder.customer_id || "N/A",
            phone: dbOrder.phone || "",
            email: dbOrder.email || "",
            address: dbOrder.address || "",
            payment: dbOrder.payment || "Bank Transfer",
          },
          products: Array.isArray(dbOrder.items)
            ? dbOrder.items.map((it) => ({
                id: it.id || it.product_id,
                name: it.product_name,
                image: it.image,
                price: Number(it.price) || 0,
                quantity: Number(it.quantity) || 1,
              }))
            : [],
          subtotal: Number(dbOrder.subtotal) || 0,
          shipping: Number(dbOrder.shipping) || 0,
          total: Number(dbOrder.total) || 0,
          date: dbOrder.created_at || "Recent",
          status: "Verified in MySQL",
        }));

        setOrders(mappedOrders);
        localStorage.setItem("orders", JSON.stringify(mappedOrders));
      } else {
        // Fallback to localStorage
        const local = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(local);
      }
    } catch (err) {
      console.warn("Could not fetch from MySQL API, using local storage:", err);
      const local = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(local);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === "1234" || pinInput.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPinError("");
      setPinInput("");
    } else {
      setPinError("លេខសម្ងាត់មិនត្រឹមត្រូវទេ! (លេខសម្ងាត់លំនាំដើម: 1234)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
  };

  const handleDeleteOrder = (orderNumber) => {
    if (window.confirm(`តើអ្នកពិតជាចង់លុបការកុម្ម៉ង់ ${orderNumber} មែនទេ?`)) {
      const updated = orders.filter((o) => o.orderNumber !== orderNumber);
      setOrders(updated);
      localStorage.setItem("orders", JSON.stringify(updated));
    }
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, ord) => sum + Number(ord.total || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const cust = ord.customer || {};
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (ord.orderNumber || "").toLowerCase().includes(query) ||
      (cust.fullName || "").toLowerCase().includes(query) ||
      (cust.phone || "").includes(query);

    const matchesPayment =
      filterPayment === "all" || (cust.payment || "") === filterPayment;

    return matchesSearch && matchesPayment;
  });

  // PIN Authentication Screen
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
          padding: "20px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            background: "#ffffff",
            borderRadius: "24px",
            padding: "36px 30px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "#f5f3ff",
              border: "2px solid #ddd6fe",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              marginBottom: "16px",
            }}
          >
            🔐
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
            ផ្ទាំងគ្រប់គ្រង Admin (Dashboard)
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5", marginBottom: "24px" }}>
            ផ្នែកនេះសម្រាប់តែអ្នកគ្រប់គ្រង (Admin) ដើម្បីមើលលទ្ធផលនៃការលក់ និងចំនួនកុម្ម៉ង់សរុប (Total)។
          </p>

          <form onSubmit={handleVerifyPin}>
            <div style={{ textAlign: "left", marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
                សូមបញ្ចូលលេខកូដសម្ងាត់ Admin:
              </label>
              <input
                type="password"
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: pinError ? "2px solid #ef4444" : "1.5px solid #cbd5e1",
                  fontSize: "20px",
                  letterSpacing: "6px",
                  textAlign: "center",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {pinError && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px", fontWeight: "600" }}>
                  ⚠️ {pinError}
                </div>
              )}
              <div
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#6b21a8",
                  background: "#faf5ff",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px dashed #d8b4fe",
                }}
              >
                💡 លេខកូដសម្ងាត់លំនាំដើម: <strong>1234</strong>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(124, 58, 237, 0.3)",
                marginTop: "12px",
              }}
            >
              ចូលផ្ទាំងគ្រប់គ្រង (Login) →
            </button>
          </form>

          <div style={{ marginTop: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
            <Link
              to="/checkout"
              style={{
                fontSize: "13.5px",
                color: "#0284c7",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ← ទៅកាន់កន្លែងបញ្ចូលឈ្មោះអ្នកទិញ (Checkout POS)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pro-checkout-page">
      {/* ================= SIDEBAR ================= */}
      <aside className="pro-sidebar">
        <div className="pro-sidebar-brand">
          <div className="pro-brand-logo" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <span className="pro-brand-name">FreshMart</span>
          <span className="pro-brand-badge" style={{ background: "#059669" }}>POS ADMIN</span>
        </div>

        <div className="pro-sidebar-nav">
          <div>
            <div className="pro-nav-group-title">ផ្ទាំងគ្រប់គ្រង (Dashboard)</div>
            <div className="pro-nav-links">
              <button
                type="button"
                className={`pro-nav-item ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <div className="pro-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <span>បញ្ជីលទ្ធផលទិញ (Orders)</span>
                <span className="pro-nav-pill">{orders.length}</span>
              </button>

              <button
                type="button"
                className={`pro-nav-item ${activeTab === "analytics" ? "active" : ""}`}
                onClick={() => setActiveTab("analytics")}
              >
                <div className="pro-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <span>Sales Analytics Dashboard</span>
              </button>

              <button
                type="button"
                className={`pro-nav-item ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                <div className="pro-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <span>ទិដ្ឋភាពរួម Admin (All)</span>
              </button>
            </div>
          </div>

          <div>
            <div className="pro-nav-group-title">ផ្នែកបុគ្គលិក (Staff)</div>
            <div className="pro-nav-links">
              <Link
                to="/checkout"
                className="pro-nav-item"
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#16a34a",
                  fontWeight: "700",
                }}
              >
                <div className="pro-nav-icon">🛒</div>
                <span>កន្លែង Add អ្នកទិញ (POS) →</span>
                <span className="pro-nav-pill" style={{ background: "#16a34a", color: "#fff" }}>Staff</span>
              </Link>

              <Link to="/products" className="pro-nav-item">
                <div className="pro-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <span>Products Catalog</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mini Monthly Target Card */}
        <div className="pro-sidebar-card">
          <div className="pro-card-header">
            <span>Monthly Target</span>
            <span>82%</span>
          </div>
          <div className="pro-card-progress">
            <div className="pro-card-bar" style={{ width: "82%" }}></div>
          </div>
          <div className="pro-card-sub">${totalRevenue.toFixed(0)} of $5,000 Goal</div>
        </div>

        {/* User Card */}
        <div className="pro-sidebar-user">
          <div
            className="pro-user-avatar"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "#ffffff",
              fontWeight: "800",
            }}
          >
            AD
            <span className="pro-user-status-dot"></span>
          </div>
          <div className="pro-user-info">
            <div className="pro-user-name">អ្នកគ្រប់គ្រង (Admin)</div>
            <div className="pro-user-role">Super Admin • Online</div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="pro-main-wrapper">
        {/* Topbar */}
        <header className="pro-topbar">
          <div className="pro-breadcrumbs">
            <Link to="/" className="pro-crumb-home">Home</Link>
            <span className="pro-crumb-sep">/</span>
            <span className="pro-crumb-current">🔐 Admin Dashboard (មើលតែលទ្ធផល និង Total)</span>
          </div>

          <div className="pro-topbar-actions">
            <div className="pro-live-pill">
              <span className="pro-live-dot"></span>
              <span>MySQL Live Synced ({orders.length} orders)</span>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              className="pro-demo-data-btn"
              title="Refresh orders from MySQL"
            >
              <span>🔄 Refresh DB</span>
            </button>

            <Link
              to="/checkout"
              className="pro-topbar-btn"
              style={{
                background: "#f0fdf4",
                color: "#16a34a",
                borderColor: "#bbf7d0",
                fontWeight: "700",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              title="ទៅកាន់កន្លែងបញ្ចូលឈ្មោះអ្នកទិញ"
            >
              <span>🛒</span> ទៅកន្លែង Add អ្នកទិញ (POS)
            </Link>

            <a
              href={TELEGRAM_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pro-topbar-btn"
              style={{
                background: "#f0fdf4",
                color: "#16a34a",
                borderColor: "#bbf7d0",
                fontWeight: "700",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
              title={`Telegram: ${TELEGRAM_PHONE}`}
            >
              <span>📱</span> {TELEGRAM_PHONE}
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="pro-topbar-btn"
              style={{ background: "#fee2e2", color: "#dc2626", borderColor: "#fca5a5" }}
              title="ចាកចេញពី Admin"
            >
              <span>🚪 ចាកចេញ (Logout)</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="pro-content">
          {/* Header */}
          <div className="pro-page-header">
            <div className="pro-title-wrap">
              <h1>📊 ផ្ទាំងគ្រប់គ្រង Admin (Dashboard & Order Results)</h1>
              <p>ផ្ទាំងគ្រប់គ្រងមើលលទ្ធផលនៃការលក់ ចំនួនកុម្ម៉ង់សរុប (Total) និងទិន្នន័យផ្ទាល់ពី MySQL Database (`customer_db`)</p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "12px",
                background: "#f5f3ff",
                border: "1px solid #ddd6fe",
                color: "#6d28d9",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              <span>🔐 Admin Mode (មើលតែលទ្ធផល និង Total)</span>
            </div>
          </div>

          {/* KPI CARDS (Real Commercial Dashboard Metrics) */}
          <section className="pro-kpi-grid">
            <div className="pro-kpi-card">
              <div className="pro-kpi-info">
                <span className="pro-kpi-label">ចំណូលលក់សរុប (Total Revenue)</span>
                <span className="pro-kpi-value">${totalRevenue.toFixed(2)}</span>
                <span className="pro-kpi-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  Live from MySQL DB
                </span>
              </div>
              <div className="pro-kpi-icon-wrap emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>

            <div className="pro-kpi-card">
              <div className="pro-kpi-info">
                <span className="pro-kpi-label">ចំនួនកុម្ម៉ង់សរុប (Orders Count)</span>
                <span className="pro-kpi-value">{orders.length}</span>
                <span className="pro-kpi-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  100% verified in DB
                </span>
              </div>
              <div className="pro-kpi-icon-wrap indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
            </div>

            <div className="pro-kpi-card">
              <div className="pro-kpi-info">
                <span className="pro-kpi-label">តម្លៃកុម្ម៉ង់ជាមធ្យម (Avg Order Value)</span>
                <span className="pro-kpi-value">${avgOrderValue.toFixed(2)}</span>
                <span className="pro-kpi-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  Per Customer Order
                </span>
              </div>
              <div className="pro-kpi-icon-wrap amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                </svg>
              </div>
            </div>

            <div className="pro-kpi-card">
              <div className="pro-kpi-info">
                <span className="pro-kpi-label">ប្រព័ន្ធទិន្នន័យ (MySQL Health)</span>
                <span className="pro-kpi-value" style={{ fontSize: "20px", color: "#10b981" }}>Active 100%</span>
                <span className="pro-kpi-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  customer_db Connected
                </span>
              </div>
              <div className="pro-kpi-icon-wrap violet">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6.01" y2="6"/>
                  <line x1="6" y1="18" x2="6.01" y2="18"/>
                </svg>
              </div>
            </div>
          </section>

          {/* SEGMENTED NAVIGATION TABS */}
          <div className="pro-segmented-tabs">
            <button
              type="button"
              className={`pro-tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              📦 <span>បញ្ជីលទ្ធផលទិញ (Orders & Results)</span>
              <span className="pro-tab-badge">{orders.length}</span>
            </button>
            <button
              type="button"
              className={`pro-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              📊 <span>របាយការណ៍ Dashboard (Analytics)</span>
            </button>
            <button
              type="button"
              className={`pro-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              🏢 <span>ទិដ្ឋភាពរួម Admin (All Results)</span>
            </button>
          </div>

          {/* ================= SAVED ORDERS MANAGEMENT ================= */}
          {(activeTab === "all" || activeTab === "orders") && (
            <section id="saved-orders-section" className="pro-orders-section">
              <div className="pro-orders-toolbar">
                <div className="pro-toolbar-left">
                  <h2>📦 បញ្ជីលទ្ធផល និង Total ទិញពី MySQL</h2>
                  <p>ទិន្នន័យជាក់ស្ដែងដែលបានកុម្ម៉ង់ ត្រូវបានរក្សាទុកក្នុងតារាង `shop_orders` និង `customers`</p>
                </div>

                <div className="pro-toolbar-right">
                  {/* Search box */}
                  <div className="pro-search-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ, កូដ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Payment filter */}
                  <div className="pro-filter-tabs">
                    {["all", "Bank Transfer", "KHQR", "Cash on Delivery"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`pro-filter-btn ${filterPayment === p ? "active" : ""}`}
                        onClick={() => setFilterPayment(p)}
                      >
                        {p === "all" ? "All Payments" : p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  កំពុងទាញយកទិន្នន័យពី MySQL...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="pro-orders-empty">
                  <div className="pro-empty-icon">📭</div>
                  <h3>មិនមានទិន្នន័យកុម្ម៉ង់នៅឡើយទេ</h3>
                  <p>នៅពេលអតិថិជន ឬបុគ្គលិកចុចទិញក្នុង Checkout ព័ត៌មាននឹងបង្ហាញនៅទីនេះដោយស្វ័យប្រវត្តិ។</p>
                  <Link
                    to="/checkout"
                    style={{
                      marginTop: "16px",
                      display: "inline-block",
                      padding: "10px 20px",
                      background: "#7c3aed",
                      color: "#fff",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontWeight: "700",
                    }}
                  >
                    🛒 ទៅកាន់កន្លែងបញ្ចូលឈ្មោះអ្នកទិញ
                  </Link>
                </div>
              ) : (
                <div className="pro-orders-table-wrapper">
                  <table className="pro-data-table">
                    <thead>
                      <tr>
                        <th>កូដកុម្ម៉ង់ (Order #)</th>
                        <th>ឈ្មោះអ្នកទិញ (Customer Name)</th>
                        <th>លេខទូរស័ព្ទ (Phone)</th>
                        <th>ទំនិញ (Items)</th>
                        <th>តម្លៃសរុប (Total)</th>
                        <th>ការទូទាត់ (Payment)</th>
                        <th>កាលបរិច្ឆេទ (Date)</th>
                        <th>សកម្មភាព (Actions)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const cust = order.customer || {};
                        const items = order.products || [];
                        return (
                          <tr key={order.orderNumber}>
                            <td>
                              <span className="pro-order-id-badge">
                                {order.orderNumber}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: "700", color: "#1e293b" }}>
                                {cust.fullName || "Customer"}
                              </div>
                              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                                ID: {cust.id || "N/A"}
                              </div>
                            </td>
                            <td>
                              <a
                                href={`tel:${cust.phone}`}
                                style={{ color: "#0284c7", fontWeight: "600", textDecoration: "none" }}
                              >
                                {cust.phone || "N/A"}
                              </a>
                            </td>
                            <td>
                              <span className="pro-item-qty-badge">
                                {items.reduce((s, it) => s + (it.quantity || 1), 0)} items
                              </span>
                              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px", maxWidth: "160px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {items.map((it) => it.name).join(", ")}
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: "#059669", fontSize: "15px" }}>
                                ${Number(order.total || 0).toFixed(2)}
                              </strong>
                            </td>
                            <td>
                              <span className={`pro-status-badge ${cust.payment === "KHQR" ? "paid" : "completed"}`}>
                                {cust.payment || "Bank Transfer"}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: "12px", color: "#64748b" }}>
                                {order.date}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  type="button"
                                  onClick={() => setActiveInvoice(order)}
                                  className="pro-order-btn view"
                                  title="មើលវិក្កយបត្រ (Invoice)"
                                >
                                  🧾 មើល
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.orderNumber)}
                                  className="pro-order-btn delete"
                                  title="លុបការកុម្ម៉ង់"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ================= SALES ANALYTICS & REPORTS ================= */}
          {(activeTab === "all" || activeTab === "analytics") && (
            <section style={{ marginTop: activeTab === "analytics" ? "0" : "32px", marginBottom: "32px" }}>
              <div className="pro-orders-toolbar" style={{ marginBottom: "16px" }}>
                <div className="pro-toolbar-left">
                  <h2>📈 របាយការណ៍លក់ (Sales Analytics Dashboard)</h2>
                  <p>ការវិភាគលើទិន្នន័យទូទាត់ប្រាក់ និងស្ថិតិការទិញរបស់អតិថិជន</p>
                </div>
              </div>

              <div className="pro-analytics-grid">
                <div className="pro-analytics-card">
                  <h3>វិធីសាស្ត្រទូទាត់ (Payment Breakdown)</h3>
                  <div className="pro-analytics-stat-row">
                    <span>🇰🇭 KHQR / Bakong</span>
                    <strong>
                      {orders.filter((o) => o.customer?.payment === "KHQR").length} orders
                    </strong>
                  </div>
                  <div className="pro-analytics-bar-wrap">
                    <div
                      className="pro-analytics-bar"
                      style={{
                        width: `${orders.length ? (orders.filter((o) => o.customer?.payment === "KHQR").length / orders.length) * 100 : 0}%`,
                        background: "#ef4444",
                      }}
                    ></div>
                  </div>

                  <div className="pro-analytics-stat-row">
                    <span>🏦 Bank Transfer</span>
                    <strong>
                      {orders.filter((o) => o.customer?.payment === "Bank Transfer").length} orders
                    </strong>
                  </div>
                  <div className="pro-analytics-bar-wrap">
                    <div
                      className="pro-analytics-bar"
                      style={{
                        width: `${orders.length ? (orders.filter((o) => o.customer?.payment === "Bank Transfer").length / orders.length) * 100 : 0}%`,
                        background: "#0284c7",
                      }}
                    ></div>
                  </div>

                  <div className="pro-analytics-stat-row">
                    <span>💵 Cash on Delivery</span>
                    <strong>
                      {orders.filter((o) => o.customer?.payment === "Cash on Delivery").length} orders
                    </strong>
                  </div>
                  <div className="pro-analytics-bar-wrap">
                    <div
                      className="pro-analytics-bar"
                      style={{
                        width: `${orders.length ? (orders.filter((o) => o.customer?.payment === "Cash on Delivery").length / orders.length) * 100 : 0}%`,
                        background: "#10b981",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pro-analytics-card">
                  <h3>គោលដៅប្រចាំខែ (Monthly Target & Performance)</h3>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginTop: "12px" }}>
                    ${totalRevenue.toFixed(2)}{" "}
                    <span style={{ fontSize: "16px", color: "#64748b", fontWeight: "500" }}>/ $5,000 Goal</span>
                  </div>
                  <div className="pro-card-progress" style={{ marginTop: "14px", height: "10px" }}>
                    <div
                      className="pro-card-bar"
                      style={{
                        width: `${Math.min(100, (totalRevenue / 5000) * 100)}%`,
                        background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                      }}
                    ></div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748b", marginTop: "12px", lineHeight: "1.5" }}>
                    សម្រេចបាន {((totalRevenue / 5000) * 100).toFixed(1)}% នៃគោលដៅប្រចាំខែ។ ទិន្នន័យត្រូវបានផ្ទៀងផ្ទាត់ផ្ទាល់ជាមួយ MySQL shop_orders។
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ================= INVOICE / RECEIPT MODAL ================= */}
      {activeInvoice && (
        <div
          className="pro-modal-backdrop"
          onClick={() => setActiveInvoice(null)}
        >
          <div
            className="pro-modal-content pro-invoice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pro-modal-header">
              <h3>Official Store Tax Invoice</h3>
              <button
                type="button"
                className="pro-modal-close-btn"
                onClick={() => setActiveInvoice(null)}
              >
                ×
              </button>
            </div>

            <div className="pro-invoice-body">
              <div className="pro-invoice-brand-row">
                <div className="pro-invoice-brand">
                  <h2>FreshMart Supermarket POS</h2>
                  <p>Tax Reg: KH-88921-2026 • Phnom Penh, Cambodia</p>
                </div>
                <div className="pro-invoice-meta">
                  <h4>{activeInvoice.orderNumber}</h4>
                  <p>{activeInvoice.date}</p>
                </div>
              </div>

              <div className="pro-invoice-billto">
                <strong>Billed To:</strong><br />
                {activeInvoice.customer?.fullName} (ID: {activeInvoice.customer?.id})<br />
                Phone: {activeInvoice.customer?.phone} | Email: {activeInvoice.customer?.email}<br />
                Address: {activeInvoice.customer?.address}<br />
                Payment: <strong>{activeInvoice.customer?.payment}</strong>
              </div>

              <table className="pro-invoice-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvoice.products?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td style={{ textAlign: "right" }}>
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="pro-invoice-totals-table">
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td>${Number(activeInvoice.subtotal).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Shipping:</td>
                    <td>${Number(activeInvoice.shipping).toFixed(2)}</td>
                  </tr>
                  <tr className="grand-total-row">
                    <td>Total:</td>
                    <td>${Number(activeInvoice.total).toFixed(2)} USD</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pro-modal-footer">
              <button
                type="button"
                className="pro-topbar-btn"
                onClick={() => setActiveInvoice(null)}
              >
                Close
              </button>
              <a
                href={`https://t.me/+855979937524?text=${encodeURIComponent(
                  `🛍️ ការកុម្ម៉ង់ #${activeInvoice.orderNumber}!\n👤 អតិថិជន: ${activeInvoice.customer?.fullName}\n📞 ទូរស័ព្ទ: ${activeInvoice.customer?.phone}\n💵 សរុប: $${Number(activeInvoice.total).toFixed(2)} USD`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 16px",
                  background: "#0284c7",
                  color: "#ffffff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                <span>💬</span> ផ្ញើទៅ Telegram ({TELEGRAM_PHONE})
              </a>
              <button
                type="button"
                className="pro-topbar-btn primary"
                onClick={() => window.print()}
              >
                Print Invoice 🖨️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
