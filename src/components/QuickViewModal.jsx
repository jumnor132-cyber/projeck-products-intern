import React, { useState } from "react";
import { addToCart } from "../utils/cart";
import { useTheme } from "../utils/theme";

export default function QuickViewModal({ product, isOpen, onClose, onBuyNow, onAddedToCart }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    if (onAddedToCart) {
      onAddedToCart(product, quantity);
    }
    onClose();
  };

  const handleBuy = () => {
    addToCart(product, quantity);
    onClose();
    if (onBuyNow) {
      onBuyNow(product);
    }
  };

  const approxRiel = Math.round(product.price * 4100).toLocaleString();
  const originalRiel = product.originalPrice
    ? Math.round(product.originalPrice * 4100).toLocaleString()
    : null;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="fm-modal-backdrop" onClick={onClose}>
      <div
        className="fm-modal-card"
        style={{ maxWidth: "780px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fm-modal-header" style={{ paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#059669",
                background: "#ecfdf5",
                padding: "3px 10px",
                borderRadius: "20px",
                textTransform: "uppercase",
              }}
            >
              {product.categoryLabel || product.category}
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              • កូដ Barcode: <code>{product.barcode || "8850124001"}</code>
            </span>
          </div>
          <button type="button" className="fm-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ padding: "20px 28px" }}>
          <div className="fm-quickview-grid">
            {/* Left: Product Image */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: isDark ? "#0b1120" : "#f8fafc",
                  border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
                  height: "320px",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80";
                  }}
                />
              </div>

              {product.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    background: "#059669",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "800",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                  }}
                >
                  {product.badge}
                </div>
              )}

              {discountPercent && (
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    background: "#ef4444",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "800",
                    padding: "4px 10px",
                    borderRadius: "20px",
                  }}
                >
                  -{discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Right: Details & Purchase Options */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: "900",
                    color: isDark ? "#f8fafc" : "#0f172a",
                    lineHeight: "1.3",
                    marginBottom: "4px",
                  }}
                >
                  {product.nameKh || product.name}
                </h2>
                {product.nameKh && product.name && (
                  <div style={{ fontSize: "14px", color: isDark ? "#94a3b8" : "#64748b", marginBottom: "14px" }}>
                    {product.name}
                  </div>
                )}

                {/* Rating & Stock */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "16px",
                    paddingBottom: "14px",
                    borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ color: "#f59e0b", fontSize: "14px", fontWeight: "700" }}>
                    {"★".repeat(Math.round(product.rating || 5))} ({product.reviews || 120} មតិវាយតម្លៃ)
                  </div>
                  <div style={{ color: isDark ? "#475569" : "#cbd5e1" }}>•</div>
                  <div style={{ fontSize: "13px", color: "#059669", fontWeight: "700" }}>
                    🟢 ស្តុក: {product.stock || 50} ឯកតា ({product.unit || "កញ្ចប់"})
                  </div>
                </div>

                {/* Pricing Block */}
                <div
                  style={{
                    background: isDark ? "#0b1120" : "#f8fafc",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
                    marginBottom: "18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span style={{ fontSize: "30px", fontWeight: "900", color: isDark ? "#f8fafc" : "#0f172a" }}>
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span
                        style={{
                          fontSize: "15px",
                          color: "#94a3b8",
                          textDecoration: "line-through",
                        }}
                      >
                        ${Number(product.originalPrice).toFixed(2)} (≈ {originalRiel} ៛)
                      </span>
                    )}
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#059669" }}>
                      (≈ {approxRiel} ៛)
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: isDark ? "#94a3b8" : "#64748b", marginTop: "4px" }}>
                    📦 ឯកតាទំនិញ: <strong>{product.unit || "1 ឯកតា"}</strong> | រួមបញ្ចូលពន្ធអាកររួចរាល់
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: "13px", color: isDark ? "#cbd5e1" : "#475569", lineHeight: "1.7", marginBottom: "18px" }}>
                  {product.description ||
                    "ទំនិញស្រស់ៗ និងមានគុណភាពខ្ពស់ ធានាសុវត្ថិភាពក្នុងការប្រើប្រាស់ និងរក្សាទុកបានត្រឹមត្រូវតាមស្តង់ដារ។"}
                </p>

                {/* Mart Assurance Badges */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background: isDark ? "rgba(16,185,129,0.15)" : "#ecfdf5",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: isDark ? "#34d399" : "#065f46",
                      fontWeight: "600",
                    }}
                  >
                    <span>🥗</span> គុណភាពស្រស់ 100%
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background: isDark ? "rgba(34,197,94,0.15)" : "#f0fdf4",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: isDark ? "#4ade80" : "#16a34a",
                      fontWeight: "600",
                    }}
                  >
                    <span>⚡</span> ដឹកជូនក្នុង 30 នាទី
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div style={{ paddingTop: "14px", borderTop: isDark ? "1px solid #1e293b" : "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: isDark ? "#f8fafc" : "#0f172a" }}>ចំនួន (Qty):</span>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: isDark ? "#0b1120" : "#f1f5f9",
                      border: isDark ? "1px solid #1e293b" : "none",
                      borderRadius: "10px",
                      padding: "4px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleQtyChange(-1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "none",
                        background: isDark ? "#1e293b" : "#ffffff",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        fontSize: "16px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      −
                    </button>
                    <span style={{ padding: "0 16px", fontWeight: "800", fontSize: "15px", color: isDark ? "#f8fafc" : "#0f172a" }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "none",
                        background: isDark ? "#1e293b" : "#ffffff",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        fontSize: "16px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: "13px", color: isDark ? "#94a3b8" : "#64748b" }}>
                    សរុប: <strong style={{ color: isDark ? "#f8fafc" : "inherit" }}>${(product.price * quantity).toFixed(2)}</strong>
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={handleAdd}
                    style={{
                      padding: "13px 20px",
                      background: "#059669",
                      color: "#ffffff",
                      borderRadius: "12px",
                      border: "none",
                      fontWeight: "800",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span>🛒</span>
                    <span>ដាក់ចូលកន្ត្រក</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuy}
                    style={{
                      padding: "13px 20px",
                      background: isDark ? "#2563eb" : "#0f172a",
                      color: "#ffffff",
                      borderRadius: "12px",
                      border: "none",
                      fontWeight: "800",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span>⚡</span>
                    <span>ទិញភ្លាម (Checkout)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
