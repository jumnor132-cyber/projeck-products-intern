import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../utils/cart";
import { useTheme } from "../utils/theme";
import MiniCartDrawer from "./MiniCartDrawer";
import LocationModal from "./LocationModal";
import TrackOrderModal from "./TrackOrderModal";
import AddProductModal from "./AddProductModal";

export default function ShopHeader({
  searchQuery = "",
  setSearchQuery,
  onProductAdded,
}) {
  const location = useLocation();
  const { totalQuantity, subtotal } = useCart();
  const { isDark, toggleTheme } = useTheme();

  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [themeToast, setThemeToast] = useState(null);

  // Selected delivery location
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return localStorage.getItem("fm_delivery_district") || "ខណ្ឌទួលគោក (Toul Kork)";
  });

  const handleSelectDistrict = (name) => {
    setSelectedDistrict(name);
    localStorage.setItem("fm_delivery_district", name);
  };

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setThemeToast(
      next === "dark"
        ? "👁️ បានប្តូរទៅ [មើលងងឹត 🌙] (Dark Mode)"
        : "👁️ បានប្តូរទៅ [មើលភ្លឺ ☀️] (Light Mode)"
    );
    setTimeout(() => {
      setThemeToast(null);
    }, 2500);
  };

  const POPULAR_SEARCHES = ["កូកាកូឡា", "ផ្លែប៉ោម", "មីម៉ាម៉ា", "ទឹកដោះគោ Meiji", "Croissant"];

  return (
    <>
      {/* Theme Switch Toast */}
      {themeToast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: isDark ? "#1e293b" : "#0f172a",
            color: "#ffffff",
            padding: "10px 22px",
            borderRadius: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: "700",
            border: "1px solid rgba(255,255,255,0.2)",
            animation: "slideInUp 0.25s ease-out",
          }}
        >
          {themeToast}
        </div>
      )}

      {/* 1. TOP NOTICE & SERVICE BAR */}
      <div className="fm-top-bar">
        <div className="fm-top-bar-inner">
          <div className="fm-top-left">
            <span className="fm-pill-badge">⚡ FreshMart Express</span>
            <span className="fm-top-sep">•</span>
            <span className="fm-delivery-promo">
              🚚 ដឹកជញ្ជូនឥតគិតថ្លៃ ចាប់ពី <strong>$15</strong> ឡើងទៅក្នុងរាជធានីភ្នំពេញ
            </span>
          </div>

          <div className="fm-top-right">
            {/* Eye Theme Switch Button (Top Bar) */}
            <button
              type="button"
              className="fm-top-link-btn fm-top-eye-btn"
              onClick={handleToggleTheme}
              title={isDark ? "ចុចដើម្បីប្តូរមកមើលភ្លឺ (Light Mode)" : "ចុចដើម្បីប្តូរទៅមើលងងឹត (Dark Mode)"}
            >
              <span style={{ fontSize: "14px" }}>👁️</span>
              <strong style={{ color: isDark ? "#38bdf8" : "#a7f3d0" }}>
                {isDark ? "មើលភ្លឺ ☀️" : "មើលងងឹត 🌙"}
              </strong>
            </button>

            <span className="fm-top-sep">•</span>

            {/* Delivery Location Selector */}
            <button
              type="button"
              className="fm-top-link-btn"
              onClick={() => setIsLocationOpen(true)}
              title="ជ្រើសរើសខណ្ឌដឹកជញ្ជូនក្នុងភ្នំពេញ"
            >
              <span>📍 ដឹកជូនដល់:</span>
              <strong>{selectedDistrict} ▾</strong>
            </button>

            <span className="fm-top-sep">•</span>

            {/* Live Store Hours */}
            <span className="fm-store-hours">
              <span className="fm-pulse-dot" />
              <span>បើកលក់ (7:00 AM - 10:30 PM)</span>
            </span>

            <span className="fm-top-sep">•</span>

            {/* Track Order */}
            <button
              type="button"
              className="fm-top-link-btn"
              onClick={() => setIsTrackOpen(true)}
              title="តាមដានការបញ្ជាទិញ"
            >
              <span>📦 តាមដានការកុម្ម៉ង់</span>
            </button>

            <span className="fm-top-sep">•</span>

            {/* Hotline & Telegram */}
            <a
              href="https://t.me/+855979937524"
              target="_blank"
              rel="noreferrer"
              className="fm-top-hotline"
              title="ទាក់ទងតាម Telegram"
            >
              <span>💬 097 993 7524</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN STORE HEADER */}
      <header className="fm-main-header">
        <div className="fm-header-inner">
          {/* Brand Logo */}
          <Link to="/" className="fm-brand-logo">
            <div className="fm-brand-icon">
              🛒
            </div>
            <div>
              <div className="fm-brand-title">
                Fresh<span>Mart</span>
                <span className="fm-brand-verified">✓ Authentic</span>
              </div>
              <div className="fm-brand-subtitle">
                SUPERMARKET & POS EXPRESS
              </div>
            </div>
          </Link>

          {/* Global Smart Search Bar */}
          <div className="fm-search-wrapper">
            <div className="fm-search-input-box">
              <span className="fm-search-icon">🔍</span>
              <input
                type="text"
                placeholder="ស្វែងរកទំនិញក្នុងម៉ាត (ឈ្មោះខ្មែរ/អង់គ្លេស, ភេសជ្ជៈ, ផ្លែឈើ, Barcode)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="fm-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery && setSearchQuery("")}
                  className="fm-search-clear"
                  title="សម្អាតការស្វែងរក"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Popular Search Suggestions (shown when set) */}
            {setSearchQuery && (
              <div className="fm-search-chips">
                <span className="fm-chips-label">ពេញនិយម:</span>
                {POPULAR_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="fm-chip-btn"
                    onClick={() => setSearchQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links & Actions */}
          <div className="fm-nav-actions">
            <nav className="fm-nav-links">
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                ទំព័រដើម
              </Link>

              <Link
                to="/products"
                className={location.pathname === "/products" ? "active" : ""}
              >
                ទំនិញទាំងអស់
              </Link>

              <Link
                to="/checkout"
                className={location.pathname === "/checkout" ? "active" : ""}
              >
                Checkout POS
              </Link>

              <Link
                to="/admin"
                className="fm-admin-nav-btn"
                title="ផ្ទាំងគ្រប់គ្រង Admin & POS (Default PIN: 1234)"
              >
                🔐 Admin
              </Link>
            </nav>

            {/* Eye Theme Toggle Button ("រូបភ្នែកសម្រាប់ចុច") in Navbar */}
            <button
              type="button"
              className={`fm-eye-theme-btn ${isDark ? "dark" : ""}`}
              onClick={handleToggleTheme}
              title={
                isDark
                  ? "ចុចរូបភ្នែកដើម្បីប្តូរមកមើលភ្លឺ (Light Mode) ☀️"
                  : "ចុចរូបភ្នែកដើម្បីប្តូរទៅមើលងងឹត (Dark Mode) 🌙"
              }
            >
              <span className="fm-eye-icon">👁️</span>
              <span className="fm-eye-label">
                {isDark ? "មើលភ្លឺ" : "មើលងងឹត"}
              </span>
            </button>

            {/* Cart Button (Opens Mini Cart Drawer) */}
            <button
              type="button"
              className="fm-header-cart-btn"
              onClick={() => setIsMiniCartOpen(true)}
              title="បើកកន្ត្រកទំនិញ"
            >
              <div className="fm-cart-icon-wrap">
                🛒
                {totalQuantity > 0 && (
                  <span className="fm-cart-badge">{totalQuantity}</span>
                )}
              </div>
              <div className="fm-cart-text-wrap">
                <span className="fm-cart-label">កន្ត្រក</span>
                <strong className="fm-cart-price">${subtotal.toFixed(2)}</strong>
              </div>
            </button>

            {/* Add Item Modal Button */}
            <button
              type="button"
              className="fm-add-product-btn"
              onClick={() => setIsAddModalOpen(true)}
              title="បន្ថែមទំនិញថ្មីចូលក្នុងម៉ាត"
            >
              <span>➕</span>
              <span className="fm-btn-text">ថែមអីវាន់</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Quick Eye Button on Bottom Left ("រូបភ្នែកសម្រាប់ចុច គ្រប់ទំព័រ") */}
      <button
        type="button"
        className={`fm-floating-eye-btn ${isDark ? "dark" : ""}`}
        onClick={handleToggleTheme}
        title={
          isDark
            ? "ចុចរូបភ្នែកដើម្បីប្តូរមកមើលភ្លឺ (Light Mode) ☀️"
            : "ចុចរូបភ្នែកដើម្បីប្តូរទៅមើលងងឹត (Dark Mode) 🌙"
        }
      >
        <span className="fm-floating-eye-icon">👁️</span>
        <span className="fm-floating-eye-text">
          {isDark ? "មើលភ្លឺ ☀️" : "មើលងងឹត 🌙"}
        </span>
      </button>

      {/* Mini Cart Drawer */}
      <MiniCartDrawer
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
      />

      {/* Delivery Location District Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={handleSelectDistrict}
      />

      {/* Live Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={(newProd) => {
          if (onProductAdded) onProductAdded(newProd);
        }}
      />
    </>
  );
}
