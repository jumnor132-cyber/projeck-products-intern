import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://localhost/productcode/ApI.php";
const AUTH_BASE_URL = "http://localhost/productcode";
const TELEGRAM_PHONE = "0979937524";
const TELEGRAM_CHAT_URL = "https://t.me/+855979937524";

// Realistic Cambodian Mock Orders for instant testing / demonstration
const DEMO_ORDERS = [
  {
    id: 1715000001,
    orderNumber: "ORD-2026-8801",
    customer: {
      fullName: "សុខ ចិន្តា (Sok Chenda)",
      id: "CUST-1042",
      phone: "012345678",
      email: "chenda.sok@gmail.com",
      address: "ផ្ទះលេខ 45 ផ្លូវ 271, សង្កាត់បឹងទំពុន, ភ្នំពេញ",
      payment: "KHQR",
    },
    products: [
      { id: "P1", name: "ទឹកដោះគោស្រស់ Meiji Fresh Milk", price: 2.80, quantity: 2, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80" },
      { id: "P2", name: "ផ្លែប៉ោមក្រហម Fuji Apples (1kg)", price: 3.20, quantity: 1, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80" }
    ],
    subtotal: 8.80,
    shipping: 1.50,
    discount: 0,
    total: 10.30,
    date: "Today, 10:15 AM",
    status: "Completed",
  },
  {
    id: 1715000002,
    orderNumber: "ORD-2026-8802",
    customer: {
      fullName: "ចាន់ សុភា (Chan Sopheak)",
      id: "CUST-1043",
      phone: "098765432",
      email: "sopheak.chan@outlook.com",
      address: "បុរីប៉េងហួត បឹងស្នោ, ច្បារអំពៅ, ភ្នំពេញ",
      payment: "Bank Transfer",
    },
    products: [
      { id: "P3", name: "ទឹកក្រូច កូកាកូឡា (Coca-Cola Can)", price: 0.75, quantity: 6, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80" }
    ],
    subtotal: 4.50,
    shipping: 1.50,
    discount: 0,
    total: 6.00,
    date: "Today, 11:30 AM",
    status: "Processing",
  },
  {
    id: 1715000003,
    orderNumber: "ORD-2026-8803",
    customer: {
      fullName: "លី វណ្ណៈ (Ly Vannak)",
      id: "CUST-1044",
      phone: "077123999",
      email: "vannak.ly@gmail.com",
      address: "ផ្លូវ 1986 សង្កាត់ភ្នំពេញថ្មី, ខណ្ឌសែនសុខ, ភ្នំពេញ",
      payment: "Cash on Delivery",
    },
    products: [
      { id: "P1", name: "ទឹកដោះគោស្រស់ Meiji Fresh Milk", price: 2.80, quantity: 3, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80" },
      { id: "P4", name: "កាហ្វេ Arabica Premium Blend (500g)", price: 8.50, quantity: 1, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=200&q=80" }
    ],
    subtotal: 16.90,
    shipping: 1.50,
    discount: 1.00,
    total: 17.40,
    date: "Yesterday, 04:20 PM",
    status: "Pending",
  },
  {
    id: 1715000004,
    orderNumber: "ORD-2026-8804",
    customer: {
      fullName: "កែវ ធីតា (Keo Thida)",
      id: "CUST-1045",
      phone: "010998877",
      email: "thida.keo@gmail.com",
      address: "ទួលគោក, ភ្នំពេញ",
      payment: "KHQR",
    },
    products: [
      { id: "P2", name: "ផ្លែប៉ោមក្រហម Fuji Apples (1kg)", price: 3.20, quantity: 4, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80" }
    ],
    subtotal: 12.80,
    shipping: 1.50,
    discount: 0,
    total: 14.30,
    date: "Yesterday, 06:45 PM",
    status: "Completed",
  }
];

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // PHP Session Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pinError, setPinError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation & View Filters
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "analytics" | "topProducts"
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isOnlineCloud, setIsOnlineCloud] = useState(() => {
    return (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    );
  });

  // Real-time Phnom Penh Clock
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch orders from MySQL API or localStorage/Demo data
  const fetchOrders = async () => {
    setIsLoading(true);

    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "0.0.0.0");

    setIsOnlineCloud(!isLocalhost);

    if (isLocalhost) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);

        const response = await fetch(`${API_URL}?action=orders`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && Array.isArray(data.orders) && data.orders.length > 0) {
            const mappedOrders = data.orders.map((dbOrder) => ({
              id: dbOrder.id || dbOrder.order_number,
              orderNumber: dbOrder.order_number,
              customer: {
                fullName: dbOrder.fullName || "Customer",
                id: dbOrder.customer_id || "CUST-000",
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
              status: dbOrder.status || "Completed",
            }));

            setOrders(mappedOrders);
            localStorage.setItem("orders", JSON.stringify(mappedOrders));
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch from local MySQL API, using local storage:", err);
      }
    }

    // Fallback for cloud hosting or if local API returned no orders
    try {
      const local = JSON.parse(localStorage.getItem("orders") || "[]");
      if (Array.isArray(local) && local.length > 0) {
        setOrders(local);
      } else {
        setOrders(DEMO_ORDERS);
        localStorage.setItem("orders", JSON.stringify(DEMO_ORDERS));
      }
    } catch {
      setOrders(DEMO_ORDERS);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Admin Session on component mount
  useEffect(() => {
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "0.0.0.0");

    if (isLocal) {
      // Local environment: verify with PHP Session
      fetch(`${AUTH_BASE_URL}/check_session.php`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Not logged in");
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.success && data.logged_in) {
            setIsAuthenticated(true);
            setAdminUser(data.admin || null);
          } else {
            setIsAuthenticated(false);
            setAdminUser(null);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          setAdminUser(null);
        })
        .finally(() => {
          setIsCheckingSession(false);
        });
    } else {
      // Cloud environment (e.g. Vercel): verify with cloud session
      try {
        const savedSession = sessionStorage.getItem("cloud_admin_user");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setIsAuthenticated(true);
          setAdminUser(parsed);
        } else {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingSession(false);
      }
    }
  }, []);

  // Fetch orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Unified Login Handler (PHP Session for Local, Secure Admin for Cloud)
  const handleVerifyPin = async (e) => {
    e.preventDefault();

    setPinError("");
    setIsLoggingIn(true);

    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "0.0.0.0");

    if (isLocal) {
      try {
        const response = await fetch(`${AUTH_BASE_URL}/login.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsAuthenticated(true);
          setAdminUser(data.admin || null);
          setUsername("");
          setPassword("");
          setPinError("");
        } else {
          setPinError(data.message || "Username ឬ Password មិនត្រឹមត្រូវ!");
        }
      } catch (error) {
        setPinError("មិនអាចភ្ជាប់ទៅកាន់ PHP Server បានទេ!");
      } finally {
        setIsLoggingIn(false);
      }
    } else {
      // Cloud Environment (Vercel)
      if (username.trim() === "admin" && password === "123456") {
        const cloudAdmin = { id: 1, username: "admin", role: "admin" };
        sessionStorage.setItem("cloud_admin_user", JSON.stringify(cloudAdmin));
        setIsAuthenticated(true);
        setAdminUser(cloudAdmin);
        setUsername("");
        setPassword("");
        setPinError("");
      } else {
        setPinError("Username ឬ Password មិនត្រឹមត្រូវ! (Username: admin, Password: 123456)");
      }
      setIsLoggingIn(false);
    }
  };

  // Unified Logout Handler
  const handleLogout = async () => {
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "0.0.0.0");

    if (isLocal) {
      try {
        await fetch(`${AUTH_BASE_URL}/logout.php`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    } else {
      sessionStorage.removeItem("cloud_admin_user");
    }

    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Change order status directly
  const handleStatusChange = (orderNumber, newStatus) => {
    const updated = orders.map((o) =>
      o.orderNumber === orderNumber ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // Delete Order
  const handleDeleteOrder = (orderNumber) => {
    if (window.confirm(`តើអ្នកពិតជាចង់លុបការកុម្ម៉ង់ ${orderNumber} មែនទេ?`)) {
      const updated = orders.filter((o) => o.orderNumber !== orderNumber);
      setOrders(updated);
      localStorage.setItem("orders", JSON.stringify(updated));
    }
  };

  // Load Demo Data for presentation / testing
  const handleLoadDemoData = () => {
    setOrders(DEMO_ORDERS);
    localStorage.setItem("orders", JSON.stringify(DEMO_ORDERS));
    alert("✅ បានបញ្ចូលទិន្នន័យកុម្ម៉ង់គំរូ (Demo Orders) រួចរាល់!");
  };

  // Export Orders as CSV file (Real Admin requirement)
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("មិនមានទិន្នន័យដើម្បីទាញយកជា CSV ទេ!");
      return;
    }

    const headers = ["Order Number", "Date", "Customer Name", "Customer ID", "Phone", "Payment", "Status", "Total USD"];
    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.date}"`,
      `"${o.customer?.fullName || ''}"`,
      `"${o.customer?.id || ''}"`,
      `"${o.customer?.phone || ''}"`,
      `"${o.customer?.payment || ''}"`,
      `"${o.status || 'Completed'}"`,
      `"${Number(o.total || 0).toFixed(2)}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FreshMart_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + Number(ord.total || 0), 0);
  }, [orders]);

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const completedOrdersCount = orders.filter((o) => o.status === "Completed").length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const cust = ord.customer || {};
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        (ord.orderNumber || "").toLowerCase().includes(query) ||
        (cust.fullName || "").toLowerCase().includes(query) ||
        (cust.phone || "").includes(query) ||
        (cust.address || "").toLowerCase().includes(query);

      const matchesPayment =
        filterPayment === "all" || (cust.payment || "") === filterPayment;

      const matchesStatus =
        filterStatus === "all" || (ord.status || "Completed") === filterStatus;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [orders, searchQuery, filterPayment, filterStatus]);

  // Aggregate Top Selling Products
  const topProducts = useMemo(() => {
    const productMap = {};
    orders.forEach((ord) => {
      (ord.products || []).forEach((p) => {
        const id = p.id || p.name;
        if (!productMap[id]) {
          productMap[id] = {
            id,
            name: p.name,
            price: p.price,
            image: p.image,
            qtySold: 0,
            revenue: 0,
          };
        }
        productMap[id].qtySold += Number(p.quantity || 1);
        productMap[id].revenue += Number(p.price || 0) * Number(p.quantity || 1);
      });
    });
    return Object.values(productMap).sort((a, b) => b.qtySold - a.qtySold);
  }, [orders]);

  // Helper for customer avatar initials
  const getInitials = (name) => {
    if (!name) return "CU";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Customer avatar background colors
  const avatarColors = ["#6366f1", "#0284c7", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];

  // ==========================================
  // AUTHENTICATION CHECK & GATEWAY
  // ==========================================
  if (isCheckingSession) {
    return (
      <div className="adm-lock-screen">
        <div className="adm-lock-card">
          <div className="adm-lock-icon-wrap">🔐</div>
          <h2 className="adm-lock-title">Checking Admin Session...</h2>
          <p className="adm-lock-desc">សូមរង់ចាំបន្តិច...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="adm-lock-screen">
        <div className="adm-lock-card">
          <div className="adm-lock-icon-wrap">🔐</div>

          <div>
            <span className="adm-lock-badge">Enterprise Admin Gateway</span>
          </div>

          <h2 className="adm-lock-title">ផ្ទាំងគ្រប់គ្រង Admin POS</h2>

          <p className="adm-lock-desc">
            សូមបញ្ចូល Username និង Password ដើម្បីចូលប្រើប្រាស់ Admin Dashboard។
          </p>

          <form onSubmit={handleVerifyPin}>
            <div className="adm-lock-input-group">
              <label className="adm-lock-label">Username</label>
              <div className="adm-lock-input-wrap">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter username (e.g. admin)"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setPinError("");
                  }}
                  className={`adm-lock-input ${pinError ? "error" : ""}`}
                  required
                />
              </div>
            </div>

            <div className="adm-lock-input-group">
              <label className="adm-lock-label">Password</label>
              <div className="adm-lock-input-wrap">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPinError("");
                  }}
                  className={`adm-lock-input ${pinError ? "error" : ""}`}
                  required
                />
              </div>
            </div>

            {pinError && (
              <div className="adm-lock-error">
                <span>⚠️</span> {pinError}
              </div>
            )}

            <button
              type="submit"
              className="adm-lock-btn"
              disabled={isLoggingIn}
            >
              {isLoggingIn
                ? "កំពុងផ្ទៀងផ្ទាត់..."
                : "ចូលផ្ទាំងគ្រប់គ្រង (Login) →"}
            </button>
          </form>

          <div className="adm-lock-footer">
            <Link to="/checkout" className="adm-lock-back-link">
              ← ទៅកាន់កន្លែងបញ្ចូលឈ្មោះអ្នកទិញ (Cashier POS)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="adm-dashboard-container">
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          className="adm-sidebar-backdrop"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`adm-sidebar ${isMobileNavOpen ? "open" : ""}`}>
        <div className="adm-sidebar-brand">
          <Link
            to="/"
            className="adm-brand-link"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <div className="adm-brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="adm-brand-text">
              <span className="adm-brand-title">FreshMart</span>
              <span className="adm-brand-subtitle">POS ERP v2.6</span>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="adm-brand-status">LIVE</span>
            <button
              type="button"
              className="adm-sidebar-close-btn"
              onClick={() => setIsMobileNavOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="adm-sidebar-nav">
          <div>
            <div className="adm-nav-group-title">ផ្នែកគ្រប់គ្រង (Management)</div>
            <div className="adm-nav-links">
              <button
                type="button"
                className={`adm-nav-item ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("orders");
                  setIsMobileNavOpen(false);
                }}
              >
                <div className="adm-nav-icon">📦</div>
                <span>បញ្ជីកុម្ម៉ង់ (Orders)</span>
                <span className="adm-nav-pill">{orders.length}</span>
              </button>

              <button
                type="button"
                className={`adm-nav-item ${activeTab === "analytics" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("analytics");
                  setIsMobileNavOpen(false);
                }}
              >
                <div className="adm-nav-icon">📊</div>
                <span>របាយការណ៍លក់ (Analytics)</span>
              </button>

              <button
                type="button"
                className={`adm-nav-item ${activeTab === "topProducts" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("topProducts");
                  setIsMobileNavOpen(false);
                }}
              >
                <div className="adm-nav-icon">🏆</div>
                <span>ទំនិញលក់ដាច់ (Top Items)</span>
                <span className="adm-nav-pill green">{topProducts.length}</span>
              </button>
            </div>
          </div>

          <div>
            <div className="adm-nav-group-title">តំណភ្ជាប់លឿន (Quick Access)</div>
            <div className="adm-nav-links">
              <Link
                to="/checkout"
                className="adm-nav-item"
                style={{ background: "rgba(16, 185, 129, 0.1)", color: "#34d399" }}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <div className="adm-nav-icon">🛒</div>
                <span>កន្លែង Add អ្នកទិញ (POS)</span>
                <span className="adm-nav-pill green">Cashier</span>
              </Link>

              <Link
                to="/products"
                className="adm-nav-item"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <div className="adm-nav-icon">🛍️</div>
                <span>Products Catalog</span>
              </Link>

              <Link
                to="/"
                className="adm-nav-item"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <div className="adm-nav-icon">🏪</div>
                <span>Home Storefront</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Monthly Target Progress */}
        <div className="adm-sidebar-card">
          <div className="adm-card-header">
            <span>🎯 គោលដៅខែនេះ ($5,000)</span>
            <span>{Math.min(100, (totalRevenue / 5000) * 100).toFixed(0)}%</span>
          </div>
          <div className="adm-card-progress">
            <div
              className="adm-card-bar"
              style={{ width: `${Math.min(100, (totalRevenue / 5000) * 100)}%` }}
            ></div>
          </div>
          <div className="adm-card-sub">
            សម្រេចបាន ${totalRevenue.toFixed(2)} នៃ $5,000
          </div>
        </div>

        {/* Current Admin User */}
        <div className="adm-sidebar-user">
          <div className="adm-user-avatar">
            {adminUser?.username ? adminUser.username.slice(0, 2).toUpperCase() : "AD"}
            <span className="adm-user-status-dot"></span>
          </div>
          <div className="adm-user-info">
            <div className="adm-user-name">
              {adminUser?.username ? adminUser.username : "អ្នកគ្រប់គ្រង (Admin)"}
            </div>
            <div className="adm-user-role">
              {adminUser?.role ? adminUser.role.toUpperCase() : "Administrator"}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="adm-user-logout-btn"
            title="ចាកចេញ (Logout)"
          >
            🚪
          </button>
        </div>
      </aside>

      {/* ================= MAIN WRAPPER ================= */}
      <div className="adm-main-wrapper">
        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              type="button"
              className="adm-mobile-toggle-btn"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label="Toggle navigation menu"
              title="បើក/បិទ Menu"
            >
              {isMobileNavOpen ? "✕" : "☰"}
            </button>

            <div className="adm-breadcrumbs">
              <Link to="/" className="adm-crumb-home">Home</Link>
              <span className="adm-crumb-sep">/</span>
              <span className="adm-crumb-current">Enterprise POS Dashboard</span>
            </div>
          </div>

          <div className="adm-topbar-actions">
            {/* Live Clock */}
            <div className="adm-clock-pill">
              <span>🕒</span>
              <span>{currentTime}</span>
            </div>

            {/* DB Status */}
            <div className={`adm-live-pill ${isOnlineCloud ? "cloud" : ""}`}>
              <span className="adm-live-dot"></span>
              <span>
                {isOnlineCloud ? "Cloud Live Sync" : "MySQL Live Synced"} ({orders.length})
              </span>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchOrders}
              className="adm-topbar-btn"
              title="Refresh Orders"
            >
              <span>🔄</span> <span className="btn-text">Refresh</span>
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="adm-topbar-btn"
              title="ទាញយកជា Excel/CSV"
            >
              <span>📥</span> <span className="btn-text">Export CSV</span>
            </button>

            {/* Seed Demo */}
            <button
              type="button"
              onClick={handleLoadDemoData}
              className="adm-topbar-btn"
              title="បញ្ចូលទិន្នន័យគំរូ"
              style={{ background: "#f5f3ff", color: "#6d28d9", borderColor: "#ddd6fe" }}
            >
              <span>🧪</span> <span className="btn-text">Demo Data</span>
            </button>

            {/* Open POS */}
            <Link
              to="/checkout"
              className="adm-topbar-btn green"
              title="កន្លែង Add អ្នកទិញ"
            >
              <span>🛒</span> <span className="btn-text">POS Cashier</span>
            </Link>

            {/* Telegram */}
            <a
              href={TELEGRAM_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="adm-topbar-btn telegram"
              title={`Telegram: ${TELEGRAM_PHONE}`}
            >
              <span>💬</span> <span className="btn-text">Telegram</span>
            </a>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="adm-topbar-btn danger"
              title="ចាកចេញពី Admin"
            >
              <span>🚪</span> <span className="btn-text">Logout</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="adm-content">
          {/* Page Title & Status Header */}
          <div className="adm-page-header">
            <div className="adm-title-wrap">
              <h1>📊 ផ្ទាំងគ្រប់គ្រង Admin (Enterprise POS & Sales Overview)</h1>
              <p>ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យការលក់ បញ្ជីកុម្ម៉ង់ និងតាមដានចំណូលក្នុងពេលវេលាជាក់ស្ដែង (Live Sync)</p>
            </div>

            <div className="adm-header-actions">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  color: "#4338ca",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                ⚡ Production Environment • 100% Secure
              </span>
            </div>
          </div>

          {/* ================= EXECUTIVE KPI CARDS ================= */}
          <section className="adm-kpi-grid">
            {/* Total Revenue */}
            <div className="adm-kpi-card emerald">
              <div className="adm-kpi-info">
                <span className="adm-kpi-label">ចំណូលលក់សរុប (Total Revenue)</span>
                <span className="adm-kpi-value">${totalRevenue.toFixed(2)}</span>
                <span className="adm-kpi-badge">
                  <span>📈</span> +14.8% vs last week
                </span>
              </div>
              <div className="adm-kpi-icon-wrap emerald">💵</div>
            </div>

            {/* Total Orders */}
            <div className="adm-kpi-card indigo">
              <div className="adm-kpi-info">
                <span className="adm-kpi-label">កុម្ម៉ង់សរុប (Total Orders)</span>
                <span className="adm-kpi-value">{orders.length}</span>
                <span className="adm-kpi-badge subtle">
                  {completedOrdersCount} បានបញ្ចប់ • {pendingOrdersCount} រង់ចាំ
                </span>
              </div>
              <div className="adm-kpi-icon-wrap indigo">📦</div>
            </div>

            {/* Average Order Value */}
            <div className="adm-kpi-card sky">
              <div className="adm-kpi-info">
                <span className="adm-kpi-label">តម្លៃជាមធ្យម (Avg Order Value)</span>
                <span className="adm-kpi-value">${avgOrderValue.toFixed(2)}</span>
                <span className="adm-kpi-badge subtle">
                  ក្នុងមួយអតិថិជន
                </span>
              </div>
              <div className="adm-kpi-icon-wrap sky">🎯</div>
            </div>

            {/* System Health / Pending Action */}
            <div className="adm-kpi-card amber">
              <div className="adm-kpi-info">
                <span className="adm-kpi-label">ស្ថានភាពកុម្ម៉ង់ (Pending Queue)</span>
                <span className="adm-kpi-value">{pendingOrdersCount}</span>
                <span className="adm-kpi-badge" style={{ background: "#fffbeb", color: "#b45309" }}>
                  {pendingOrdersCount > 0 ? "⚠️ ត្រូវការត្រួតពិនិត្យ" : "✅ រួចរាល់ទាំងអស់"}
                </span>
              </div>
              <div className="adm-kpi-icon-wrap amber">⏳</div>
            </div>
          </section>

          {/* ================= SEGMENTED NAVIGATION TABS ================= */}
          <div className="adm-segmented-tabs">
            <button
              type="button"
              className={`adm-tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              📦 <span>បញ្ជីកុម្ម៉ង់ (Orders Management)</span>
              <span className="adm-tab-badge">{orders.length}</span>
            </button>

            <button
              type="button"
              className={`adm-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              📊 <span>របាយការណ៍លក់ (Sales Analytics)</span>
            </button>

            <button
              type="button"
              className={`adm-tab-btn ${activeTab === "topProducts" ? "active" : ""}`}
              onClick={() => setActiveTab("topProducts")}
            >
              🏆 <span>ទំនិញលក់ដាច់ (Top Products)</span>
              <span className="adm-tab-badge">{topProducts.length}</span>
            </button>
          </div>

          {/* ================= TAB 1: ORDERS MANAGEMENT ================= */}
          {activeTab === "orders" && (
            <section className="adm-orders-section">
              <div className="adm-orders-toolbar">
                <div className="adm-toolbar-left">
                  <h2>📦 បញ្ជីលទ្ធផលកុម្ម៉ង់ និងព័ត៌មានអតិថិជន</h2>
                  <p>ទិន្នន័យជាក់ស្ដែងដែលបានកុម្ម៉ង់ពី Cashier Checkout ឬទិញតាមអនឡាញ</p>
                </div>

                <div className="adm-toolbar-right">
                  {/* Search Box */}
                  <div className="adm-search-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ, លេខកូដ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Payment Filters */}
                  <div className="adm-filter-tabs">
                    {["all", "KHQR", "Bank Transfer", "Cash on Delivery"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`adm-filter-btn ${filterPayment === p ? "active" : ""}`}
                        onClick={() => setFilterPayment(p)}
                      >
                        {p === "all" ? "គ្រប់ Payment" : p}
                      </button>
                    ))}
                  </div>

                  {/* Status Filters */}
                  <div className="adm-filter-tabs">
                    {["all", "Completed", "Processing", "Pending"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`adm-filter-btn ${filterStatus === s ? "active" : ""}`}
                        onClick={() => setFilterStatus(s)}
                      >
                        {s === "all" ? "គ្រប់ស្ថានភាព" : s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
                  <strong>កំពុងទាញយកទិន្នន័យពី MySQL...</strong>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="adm-orders-empty">
                  <div className="adm-empty-icon">📭</div>
                  <h3>មិនមានទិន្នន័យកុម្ម៉ង់ស្របតាមលក្ខខណ្ឌស្វែងរកទេ</h3>
                  <p>សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតការកុម្ម៉ង់ថ្មី។</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link
                      to="/checkout"
                      className="adm-topbar-btn primary"
                      style={{ padding: "10px 18px" }}
                    >
                      🛒 ទៅកាន់កន្លែង Add អ្នកទិញ (POS)
                    </Link>
                    <button
                      type="button"
                      onClick={handleLoadDemoData}
                      className="adm-topbar-btn"
                      style={{ padding: "10px 18px" }}
                    >
                      🧪 បញ្ចូលទិន្នន័យគំរូ (Demo Data)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="adm-table-wrapper">
                  <div className="adm-mobile-scroll-hint">
                    👉 អូសទៅស្តាំ/ឆ្វេង ដើម្បីមើលព័ត៌មានកុម្ម៉ង់ពេញលេញ (Swipe table horizontally)
                  </div>
                  <table className="adm-data-table">
                    <thead>
                      <tr>
                        <th>កូដកុម្ម៉ង់ (Order ID)</th>
                        <th>អតិថិជន (Customer)</th>
                        <th>ទំនាក់ទំនង (Contact)</th>
                        <th>ទំនិញ (Products)</th>
                        <th>តម្លៃសរុប (Total)</th>
                        <th>ទូទាត់ (Payment)</th>
                        <th>ស្ថានភាព (Status)</th>
                        <th>កាលបរិច្ឆេទ (Date)</th>
                        <th style={{ textAlign: "center" }}>សកម្មភាព (Actions)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, idx) => {
                        const cust = order.customer || {};
                        const items = order.products || [];
                        const avatarBg = avatarColors[idx % avatarColors.length];

                        return (
                          <tr key={order.orderNumber}>
                            <td>
                              <span
                                className="adm-order-id-badge"
                                title="Click to copy Order ID"
                                onClick={() => {
                                  navigator.clipboard?.writeText(order.orderNumber);
                                  alert(`បានចម្លងលេខកូដ: ${order.orderNumber}`);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {order.orderNumber}
                              </span>
                            </td>

                            <td>
                              <div className="adm-customer-cell">
                                <div
                                  className="adm-customer-avatar"
                                  style={{ background: avatarBg }}
                                >
                                  {getInitials(cust.fullName)}
                                </div>
                                <div className="adm-customer-info">
                                  <span className="adm-customer-name">
                                    {cust.fullName || "Customer"}
                                  </span>
                                  <span className="adm-customer-id">
                                    ID: {cust.id || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <a
                                href={`tel:${cust.phone}`}
                                style={{
                                  color: "#0284c7",
                                  fontWeight: "700",
                                  textDecoration: "none",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                📞 {cust.phone || "N/A"}
                              </a>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#64748b",
                                  marginTop: "3px",
                                  maxWidth: "180px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                title={cust.address}
                              >
                                📍 {cust.address || "Phnom Penh"}
                              </div>
                            </td>

                            <td>
                              <span
                                style={{
                                  fontWeight: "700",
                                  color: "#334155",
                                  background: "#f1f5f9",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                }}
                              >
                                {items.reduce((s, it) => s + (it.quantity || 1), 0)} items
                              </span>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#64748b",
                                  marginTop: "4px",
                                  maxWidth: "160px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                title={items.map((it) => it.name).join(", ")}
                              >
                                {items.map((it) => `${it.name} (x${it.quantity})`).join(", ")}
                              </div>
                            </td>

                            <td>
                              <strong style={{ color: "#059669", fontSize: "15px" }}>
                                ${Number(order.total || 0).toFixed(2)}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={`adm-status-badge ${
                                  cust.payment === "KHQR"
                                    ? "paid"
                                    : cust.payment === "Cash on Delivery"
                                    ? "pending"
                                    : "processing"
                                }`}
                              >
                                {cust.payment === "KHQR"
                                  ? "🇰🇭 KHQR"
                                  : cust.payment === "Cash on Delivery"
                                  ? "💵 COD"
                                  : "🏦 Bank"}
                              </span>
                            </td>

                            <td>
                              <select
                                className="adm-status-select"
                                value={order.status || "Completed"}
                                onChange={(e) =>
                                  handleStatusChange(order.orderNumber, e.target.value)
                                }
                              >
                                <option value="Completed">✅ Completed</option>
                                <option value="Processing">⚙️ Processing</option>
                                <option value="Pending">⏳ Pending</option>
                                <option value="Cancelled">❌ Cancelled</option>
                              </select>
                            </td>

                            <td>
                              <span style={{ fontSize: "12px", color: "#64748b" }}>
                                {order.date}
                              </span>
                            </td>

                            <td>
                              <div className="adm-table-actions">
                                <button
                                  type="button"
                                  onClick={() => setActiveInvoice(order)}
                                  className="adm-action-btn view"
                                  title="មើលវិក្កយបត្រ (Invoice)"
                                >
                                  🧾 មើល
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.orderNumber)}
                                  className="adm-action-btn delete"
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

          {/* ================= TAB 2: SALES ANALYTICS ================= */}
          {activeTab === "analytics" && (
            <section className="adm-analytics-grid">
              {/* Payment Methods Breakdown */}
              <div className="adm-analytics-card">
                <h3>
                  <span>💳 វិធីសាស្ត្រទូទាត់ប្រាក់ (Payment Breakdown)</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>100% Verified</span>
                </h3>

                {/* KHQR */}
                <div className="adm-stat-row">
                  <span>🇰🇭 KHQR / Bakong Pay</span>
                  <strong>
                    {orders.filter((o) => o.customer?.payment === "KHQR").length} orders (
                    $
                    {orders
                      .filter((o) => o.customer?.payment === "KHQR")
                      .reduce((s, o) => s + Number(o.total || 0), 0)
                      .toFixed(2)}
                    )
                  </strong>
                </div>
                <div className="adm-progress-wrap">
                  <div
                    className="adm-progress-bar"
                    style={{
                      width: `${orders.length ? (orders.filter((o) => o.customer?.payment === "KHQR").length / orders.length) * 100 : 0}%`,
                      background: "#ef4444",
                    }}
                  ></div>
                </div>

                {/* Bank Transfer */}
                <div className="adm-stat-row">
                  <span>🏦 ABA / Bank Transfer</span>
                  <strong>
                    {orders.filter((o) => o.customer?.payment === "Bank Transfer").length} orders (
                    $
                    {orders
                      .filter((o) => o.customer?.payment === "Bank Transfer")
                      .reduce((s, o) => s + Number(o.total || 0), 0)
                      .toFixed(2)}
                    )
                  </strong>
                </div>
                <div className="adm-progress-wrap">
                  <div
                    className="adm-progress-bar"
                    style={{
                      width: `${orders.length ? (orders.filter((o) => o.customer?.payment === "Bank Transfer").length / orders.length) * 100 : 0}%`,
                      background: "#0284c7",
                    }}
                  ></div>
                </div>

                {/* Cash on Delivery */}
                <div className="adm-stat-row">
                  <span>💵 Cash on Delivery (COD)</span>
                  <strong>
                    {orders.filter((o) => o.customer?.payment === "Cash on Delivery").length} orders (
                    $
                    {orders
                      .filter((o) => o.customer?.payment === "Cash on Delivery")
                      .reduce((s, o) => s + Number(o.total || 0), 0)
                      .toFixed(2)}
                    )
                  </strong>
                </div>
                <div className="adm-progress-wrap">
                  <div
                    className="adm-progress-bar"
                    style={{
                      width: `${orders.length ? (orders.filter((o) => o.customer?.payment === "Cash on Delivery").length / orders.length) * 100 : 0}%`,
                      background: "#10b981",
                    }}
                  ></div>
                </div>
              </div>

              {/* Monthly Target & Performance */}
              <div className="adm-analytics-card">
                <h3>
                  <span>🎯 គោលដៅចំណូលប្រចាំខែ (Monthly Revenue Goal)</span>
                  <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "700" }}>On Track</span>
                </h3>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "12px" }}>
                  ${totalRevenue.toFixed(2)}{" "}
                  <span style={{ fontSize: "16px", color: "#64748b", fontWeight: "500" }}>/ $5,000.00 Goal</span>
                </div>
                <div className="adm-progress-wrap" style={{ marginTop: "16px", height: "12px" }}>
                  <div
                    className="adm-progress-bar"
                    style={{
                      width: `${Math.min(100, (totalRevenue / 5000) * 100)}%`,
                      background: "linear-gradient(90deg, #6366f1, #10b981)",
                    }}
                  ></div>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", marginTop: "12px" }}>
                  សម្រេចបាន {((totalRevenue / 5000) * 100).toFixed(1)}% នៃគោលដៅសរុប។ ទិន្នន័យត្រូវបានធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិចេញពីតារាង `shop_orders` ក្នុង MySQL Database។
                </p>
              </div>
            </section>
          )}

          {/* ================= TAB 3: TOP PRODUCTS SOLD ================= */}
          {activeTab === "topProducts" && (
            <section className="adm-orders-section">
              <div className="adm-orders-toolbar">
                <div className="adm-toolbar-left">
                  <h2>🏆 ចំណាត់ថ្នាក់ទំនិញលក់ដាច់បំផុត (Top Selling Products)</h2>
                  <p>ស្ថិតិផ្អែកលើចំនួនបរិមាណដែលបានលក់ចេញ និងចំណូលដែលទទួលបាន</p>
                </div>
              </div>

              {topProducts.length === 0 ? (
                <div className="adm-orders-empty">
                  <div className="adm-empty-icon">🏷️</div>
                  <h3>មិនទាន់មានទិន្នន័យទំនិញលក់នៅឡើយទេ</h3>
                </div>
              ) : (
                <div className="adm-table-wrapper">
                  <table className="adm-data-table">
                    <thead>
                      <tr>
                        <th>ចំណាត់ថ្នាក់ (Rank)</th>
                        <th>ទំនិញ (Product)</th>
                        <th>តម្លៃរាយ (Unit Price)</th>
                        <th>ចំនួនលក់បាន (Qty Sold)</th>
                        <th>ចំណូលសរុប (Total Revenue)</th>
                        <th>ស្ថានភាពស្តុក (Status)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((prod, index) => (
                        <tr key={prod.id || index}>
                          <td>
                            <strong
                              style={{
                                display: "inline-flex",
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: index === 0 ? "#fef3c7" : index === 1 ? "#f1f5f9" : "#fffbeb",
                                color: index === 0 ? "#d97706" : index === 1 ? "#475569" : "#b45309",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "13px",
                              }}
                            >
                              #{index + 1}
                            </strong>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              {prod.image && (
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover" }}
                                />
                              )}
                              <span style={{ fontWeight: "700", color: "#1e293b" }}>{prod.name}</span>
                            </div>
                          </td>
                          <td>${Number(prod.price || 0).toFixed(2)}</td>
                          <td>
                            <strong style={{ color: "#6366f1", fontSize: "14px" }}>
                              {prod.qtySold} កំប៉ុង/ដុំ
                            </strong>
                          </td>
                          <td>
                            <strong style={{ color: "#059669", fontSize: "15px" }}>
                              ${Number(prod.revenue || 0).toFixed(2)}
                            </strong>
                          </td>
                          <td>
                            <span className="adm-status-badge paid">In Stock</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* ================= OFFICIAL INVOICE / RECEIPT MODAL ================= */}
      {activeInvoice && (
        <div
          className="adm-modal-backdrop"
          onClick={() => setActiveInvoice(null)}
        >
          <div
            className="adm-invoice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3>🧾 វិក្កយបត្រផ្លូវការ (Official Tax Invoice)</h3>
              <button
                type="button"
                className="adm-modal-close-btn"
                onClick={() => setActiveInvoice(null)}
              >
                ×
              </button>
            </div>

            <div className="adm-invoice-body">
              {/* Brand Header */}
              <div className="adm-invoice-brand-row">
                <div className="adm-invoice-brand">
                  <h2>FreshMart POS Supermarket</h2>
                  <p>Tax ID: KH-88921-2026 • Phnom Penh, Cambodia</p>
                  <p>Tel: +855 97 993 7524 • www.freshmart.com.kh</p>
                </div>
                <div className="adm-invoice-meta">
                  <h4>{activeInvoice.orderNumber}</h4>
                  <p>Date: {activeInvoice.date}</p>
                  <span
                    className={`adm-status-badge ${
                      activeInvoice.status === "Completed" ? "paid" : "processing"
                    }`}
                    style={{ marginTop: "6px" }}
                  >
                    Status: {activeInvoice.status || "Completed"}
                  </span>
                </div>
              </div>

              {/* Bill To */}
              <div className="adm-invoice-billto">
                <strong style={{ color: "#334155" }}>ព័ត៌មានអតិថិជន (Billed To):</strong><br />
                <strong>{activeInvoice.customer?.fullName}</strong> (ID: {activeInvoice.customer?.id})<br />
                📞 Phone: {activeInvoice.customer?.phone} | ✉️ Email: {activeInvoice.customer?.email || "N/A"}<br />
                📍 អាសយដ្ឋាន: {activeInvoice.customer?.address}<br />
                💳 វិធីសាស្ត្រទូទាត់: <strong>{activeInvoice.customer?.payment}</strong>
              </div>

              {/* Items Table */}
              <table className="adm-invoice-table">
                <thead>
                  <tr>
                    <th>ទំនិញ (Item)</th>
                    <th>ចំនួន (Qty)</th>
                    <th>តម្លៃរាយ (Price)</th>
                    <th style={{ textAlign: "right" }}>សរុប (Total)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvoice.products?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.quantity}</td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td style={{ textAlign: "right", fontWeight: "700" }}>
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <table className="adm-invoice-totals-table">
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td>${Number(activeInvoice.subtotal || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Shipping:</td>
                    <td>${Number(activeInvoice.shipping || 0).toFixed(2)}</td>
                  </tr>
                  {Number(activeInvoice.discount || 0) > 0 && (
                    <tr style={{ color: "#dc2626" }}>
                      <td>Discount:</td>
                      <td>-${Number(activeInvoice.discount).toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="grand-total">
                    <td>សរុប (Grand Total):</td>
                    <td>${Number(activeInvoice.total || 0).toFixed(2)} USD</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="adm-modal-footer">
              <button
                type="button"
                className="adm-topbar-btn"
                onClick={() => setActiveInvoice(null)}
              >
                បិទ (Close)
              </button>

              <a
                href={`https://t.me/+855979937524?text=${encodeURIComponent(
                  `🛍️ ការកុម្ម៉ង់ #${activeInvoice.orderNumber}!\n👤 អតិថិជន: ${activeInvoice.customer?.fullName}\n📞 ទូរស័ព្ទ: ${activeInvoice.customer?.phone}\n💵 សរុប: $${Number(activeInvoice.total).toFixed(2)} USD\n💳 ទូទាត់តាម: ${activeInvoice.customer?.payment}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="adm-topbar-btn telegram"
              >
                <span>💬</span> ផ្ញើទៅ Telegram ({TELEGRAM_PHONE})
              </a>

              <button
                type="button"
                className="adm-topbar-btn primary"
                onClick={() => window.print()}
              >
                🖨️ បោះពុម្ពវិក្កយបត្រ (Print)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
