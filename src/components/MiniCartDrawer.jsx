import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../utils/cart";
import { useTheme } from "../utils/theme";

export default function MiniCartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { cart, totalQuantity, subtotal, updateCartQuantity, removeFromCart } = useCart();

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 15;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freePercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const approxRiel = Math.round(subtotal * 4100).toLocaleString();

  return (
    <div className="fm-drawer-backdrop" onClick={onClose}>
      <div
        className="fm-drawer-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="fm-drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🛒</span>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: "800", color: isDark ? "#f8fafc" : "#0f172a", margin: 0 }}>
                កន្ត្រកទំនិញរបស់អ្នក
              </h3>
              <span style={{ fontSize: "12px", color: isDark ? "#94a3b8" : "#64748b" }}>
                សរុប {totalQuantity} ឯកតា ({cart.length} មុខ)
              </span>
            </div>
          </div>
          <button type="button" className="fm-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div
          style={{
            padding: "12px 20px",
            background: remainingForFree === 0
              ? (isDark ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5")
              : (isDark ? "#131d31" : "#f8fafc"),
            borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              fontWeight: "700",
              color: remainingForFree === 0
                ? (isDark ? "#34d399" : "#059669")
                : (isDark ? "#cbd5e1" : "#334155"),
              marginBottom: "6px",
            }}
          >
            {remainingForFree === 0 ? (
              <span>🎉 អបអរសាទរ! អ្នកទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ!</span>
            ) : (
              <span>
                ទិញថែម <strong style={{ color: "#059669" }}>${remainingForFree.toFixed(2)}</strong> ទៀតដើម្បីដឹកជញ្ជូនឥតគិតថ្លៃ!
              </span>
            )}
            <span>{freePercent}%</span>
          </div>

          <div
            style={{
              height: "7px",
              width: "100%",
              background: isDark ? "#1e293b" : "#e2e8f0",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${freePercent}%`,
                background: remainingForFree === 0 ? "#10b981" : "linear-gradient(90deg, #059669, #34d399)",
                borderRadius: "10px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 10px" }}>
              <div style={{ fontSize: "52px", marginBottom: "14px" }}>🧺</div>
              <h4 style={{ fontSize: "16px", fontWeight: "800", color: isDark ? "#f8fafc" : "#1e293b", marginBottom: "6px" }}>
                កន្ត្រកទំនិញរបស់អ្នកទទេ
              </h4>
              <p style={{ fontSize: "13px", color: isDark ? "#94a3b8" : "#64748b", marginBottom: "20px" }}>
                សូមជ្រើសរើសទំនិញក្នុងម៉ាតស្រស់ៗដែលអ្នកពេញចិត្ត!
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/products");
                }}
                style={{
                  padding: "10px 22px",
                  background: "#059669",
                  color: "#ffffff",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                ទិញទំនិញឥឡូវនេះ →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "14px",
                    background: isDark ? "#131d31" : "#ffffff",
                    border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
                    position: "relative",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      background: isDark ? "#1e293b" : "#f1f5f9",
                      border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h4
                        style={{
                          fontSize: "13px",
                          fontWeight: "800",
                          color: isDark ? "#f8fafc" : "#0f172a",
                          margin: 0,
                          lineHeight: "1.3",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#94a3b8",
                          cursor: "pointer",
                          fontSize: "13px",
                          padding: "0 0 0 8px",
                        }}
                        title="លុបចេញ"
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ fontSize: "11px", color: isDark ? "#94a3b8" : "#64748b", margin: "2px 0 6px" }}>
                      {item.unit ? `${item.unit} • ` : ""}${Number(item.price).toFixed(2)} / ឯកតា
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {/* Stepper */}
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background: isDark ? "#0b1120" : "#f1f5f9",
                          border: isDark ? "1px solid #1e293b" : "none",
                          borderRadius: "8px",
                          padding: "2px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            border: "none",
                            background: isDark ? "#1e293b" : "#ffffff",
                            color: isDark ? "#f8fafc" : "#0f172a",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          −
                        </button>
                        <span style={{ padding: "0 10px", fontSize: "13px", fontWeight: "800", color: isDark ? "#f8fafc" : "#0f172a" }}>
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            border: "none",
                            background: isDark ? "#1e293b" : "#ffffff",
                            color: isDark ? "#f8fafc" : "#0f172a",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +
                        </button>
                      </div>

                      <strong style={{ fontSize: "14px", fontWeight: "900", color: "#059669" }}>
                        ${(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "18px 20px",
              background: isDark ? "#131d31" : "#ffffff",
              borderTop: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
              boxShadow: "0 -4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "14px",
              }}
            >
              <div>
                <span style={{ fontSize: "13px", color: isDark ? "#94a3b8" : "#64748b" }}>សរុបរួម (Subtotal):</span>
                <div style={{ fontSize: "11px", color: "#059669", fontWeight: "700" }}>
                  ≈ {approxRiel} ៛
                </div>
              </div>
              <span style={{ fontSize: "24px", fontWeight: "900", color: isDark ? "#f8fafc" : "#0f172a" }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "linear-gradient(135deg, #059669, #047857)",
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
                  boxShadow: "0 4px 14px rgba(5, 150, 105, 0.25)",
                }}
              >
                <span>🧾</span>
                <span>បន្តទៅ Checkout POS →</span>
              </button>

              <Link
                to="/cart"
                onClick={onClose}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: isDark ? "#1e293b" : "#f1f5f9",
                  color: isDark ? "#f8fafc" : "#334155",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "13px",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                មើលកន្ត្រកពេញ (View Full Cart)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
