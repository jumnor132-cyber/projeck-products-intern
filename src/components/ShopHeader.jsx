import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../utils/cart";
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

  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Selected delivery location
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return localStorage.getItem("fm_delivery_district") || "ខណ្ឌទួលគោក (Toul Kork)";
  });

  const handleSelectDistrict = (name) => {
    setSelectedDistrict(name);
    localStorage.setItem("fm_delivery_district", name);
  };

  const POPULAR_SEARCHES = ["កូកាកូឡា", "ផ្លែប៉ោម", "មីម៉ាម៉ា", "ទឹកដោះគោ Meiji", "Croissant"];

  return (
    <>
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
