import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../utils/cart";
import "../index.css";

function Cart() {
  const { cart, totalQuantity, subtotal, updateCartQuantity, removeFromCart, clearCart } =
    useCart();

  // Mart shipping: Free if subtotal >= $15, otherwise $1.50
  const shipping = cart.length > 0 ? (subtotal >= 15 ? 0 : 1.5) : 0;
  const total = subtotal + shipping;
  const approxTotalRiel = Math.round(total * 4100).toLocaleString();

  return (
    <div className="home-page">
      {/* Navbar */}
      <header className="shop-navbar" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <Link to="/" className="shop-logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "28px" }}>🏪</span>
          <div>
            <span style={{ color: "#0f172a", fontWeight: "900", letterSpacing: "-0.5px" }}>
              Fresh<span style={{ color: "#059669" }}>Mart</span>
            </span>
            <span
              style={{
                display: "block",
                fontSize: "10px",
                fontWeight: "700",
                color: "#64748b",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginTop: "-4px",
              }}
            >
              Supermarket & POS
            </span>
          </div>
        </Link>

        <nav className="shop-nav-links">
          <Link to="/">ទំព័រដើម (Home)</Link>
          <Link to="/products">ទំនិញទាំងអស់</Link>
          <Link to="/cart" className="active shop-cart-nav" style={{ color: "#059669", fontWeight: "700" }}>
            កន្ត្រកទំនិញ 🛒
            {totalQuantity > 0 && (
              <span className="shop-cart-badge" style={{ background: "#ef4444" }}>
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link
            to="/admin"
            style={{
              color: "#7c3aed",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
              background: "#f5f3ff",
              borderRadius: "8px",
              border: "1px solid #ddd6fe",
              fontSize: "13px",
            }}
            title="ចូលផ្ទាំងគ្រប់គ្រង (Admin Dashboard)"
          >
            🔐 Admin
          </Link>
        </nav>

        <Link
          to="/products"
          className="shop-nav-button"
          style={{ background: "#059669" }}
        >
          បន្តទិញទំនិញ →
        </Link>
      </header>

      {/* Banner */}
      <section
        className="cart-banner"
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
          color: "#ffffff",
          padding: "45px 7% 40px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "#a7f3d0",
            fontWeight: "800",
            fontSize: "12px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          YOUR SHOPPING BASKET
        </span>
        <h1 style={{ fontSize: "36px", fontWeight: "900", margin: "8px 0" }}>
          កន្ត្រកទំនិញរបស់អ្នក <span>(Cart Basket)</span>
        </h1>
        <p style={{ color: "#e2e8f0", fontSize: "14px" }}>
          ពិនិត្យមុខទំនិញដែលបានជ្រើសរើស មុនពេលបន្តទៅកាន់ Checkout & បញ្ចូលព័ត៌មានអ្នកទិញ។
        </p>

        <div className="products-breadcrumb" style={{ justifyContent: "center", marginTop: "16px" }}>
          <Link to="/" style={{ color: "#a7f3d0" }}>ទំព័រដើម</Link>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
          <strong style={{ color: "#ffffff" }}>កន្ត្រកទំនិញ ({totalQuantity})</strong>
        </div>
      </section>

      {/* Cart Content */}
      <section className="cart-section" style={{ padding: "40px 7% 70px", background: "#f8fafc" }}>
        <div className="cart-heading" style={{ marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
              មុខទំនិញក្នុងកន្ត្រក ({cart.length} មុខ)
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              សរុប {totalQuantity} ឯកតាក្នុងកន្ត្រក
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("តើអ្នកចង់លុបទំនិញទាំងអស់ចេញពីកន្ត្រកមែនទេ?")) {
                    clearCart();
                  }
                }}
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                🗑️ សម្អាតកន្ត្រក
              </button>
            )}

            <Link to="/products" className="cart-continue" style={{ color: "#059669", fontWeight: "700" }}>
              ← បន្តទិញទំនិញក្នុងម៉ាត
            </Link>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty" style={{ background: "#ffffff", borderRadius: "20px", padding: "60px 20px" }}>
            <div className="cart-empty-icon" style={{ fontSize: "56px" }}>🛒</div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>
              កន្ត្រកទំនិញរបស់អ្នកទទេស្អាត
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              មិនទាន់មានទំនិញក្នុងកន្ត្រកនៅឡើយទេ។ សូមជ្រើសរើសទំនិញក្នុងម៉ាតដែលអ្នកពេញចិត្ត!
            </p>
            <Link
              to="/products"
              className="shop-primary-button"
              style={{ background: "#059669", padding: "12px 24px" }}
            >
              ជ្រើសរើសទំនិញក្នុងម៉ាត →
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Product List */}
            <div className="cart-items" style={{ background: "#ffffff", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
              <div className="cart-table-heading" style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <span>ទំនិញ (PRODUCT)</span>
                <span>តម្លៃឯកតា (PRICE)</span>
                <span>ចំនួន (QUANTITY)</span>
                <span>សរុប (TOTAL)</span>
              </div>

              {cart.map((item) => (
                <div className="cart-item" key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div className="cart-product">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80";
                      }}
                    />

                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#059669",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.category} {item.unit ? `• ${item.unit}` : ""}
                      </span>
                      <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "2px 0 6px" }}>
                        {item.name}
                      </h3>
                      {item.sku && (
                        <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace", marginBottom: "6px" }}>
                          SKU: {item.sku}
                        </div>
                      )}
                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => removeFromCart(item.id)}
                        style={{ color: "#ef4444", fontWeight: "600", fontSize: "12px", border: "none", background: "none", cursor: "pointer", padding: 0 }}
                      >
                        ✕ លុបចេញ
                      </button>
                    </div>
                  </div>

                  <div className="cart-price" style={{ fontWeight: "700", color: "#0f172a" }}>
                    ${Number(item.price).toFixed(2)}
                  </div>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                      style={{ border: "1px solid #cbd5e1", borderRadius: "8px" }}
                    >
                      −
                    </button>

                    <span style={{ fontWeight: "700" }}>{item.quantity || 1}</span>

                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, 1)}
                      aria-label="Increase quantity"
                      style={{ border: "1px solid #cbd5e1", borderRadius: "8px" }}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total" style={{ fontWeight: "900", color: "#059669" }}>
                    ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <aside
              className="cart-summary"
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", marginBottom: "16px" }}>
                សង្ខេបការទូទាត់ (Summary)
              </h3>

              <div className="cart-summary-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "#64748b" }}>តម្លៃទំនិញសរុប (Subtotal)</span>
                <strong style={{ color: "#0f172a" }}>${subtotal.toFixed(2)}</strong>
              </div>

              <div className="cart-summary-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "#64748b" }}>ថ្លៃដឹកជញ្ជូន (Delivery)</span>
                <strong style={{ color: shipping === 0 ? "#059669" : "#0f172a" }}>
                  {shipping === 0 ? "FREE (ឥតគិតថ្លៃ)" : `$${shipping.toFixed(2)}`}
                </strong>
              </div>

              {subtotal > 0 && subtotal < 15 && (
                <p
                  className="cart-shipping-note"
                  style={{
                    background: "#ecfdf5",
                    color: "#059669",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    margin: "12px 0",
                  }}
                >
                  🎉 ទិញថែម ${(15 - subtotal).toFixed(2)} ទៀត ដើម្បីទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ!
                </p>
              )}

              <div
                className="cart-summary-total"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingTop: "14px",
                  borderTop: "2px dashed #e2e8f0",
                  marginTop: "14px",
                }}
              >
                <div>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>សរុបចុងក្រោយ (Total)</span>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>≈ {approxTotalRiel} ៛</div>
                </div>
                <strong style={{ fontSize: "24px", fontWeight: "900", color: "#059669" }}>
                  ${total.toFixed(2)}
                </strong>
              </div>

              <Link
                to="/checkout"
                className="cart-checkout"
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "#ffffff",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "15px",
                  marginTop: "20px",
                  boxShadow: "0 4px 15px rgba(5, 150, 105, 0.3)",
                }}
              >
                បន្តទៅ Checkout & បញ្ចូលឈ្មោះអ្នកទិញ →
              </Link>

              <div
                className="cart-secure"
                style={{
                  textAlign: "center",
                  marginTop: "14px",
                  fontSize: "12px",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <span>🔒</span>
                <span>ទិន្នន័យត្រូវបានរក្សាទុកក្នុង MySQL តាមរយៈ PHP API</span>
              </div>
            </aside>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "40px 7% 24px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            paddingBottom: "20px",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>🏪</span>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "#ffffff" }}>
              Fresh<span style={{ color: "#34d399" }}>Mart</span> Basket
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#e2e8f0", fontSize: "14px", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/products" style={{ color: "#e2e8f0", fontSize: "14px", textDecoration: "none" }}>
              Products
            </Link>
            <Link to="/checkout" style={{ color: "#34d399", fontSize: "14px", fontWeight: "700" }}>
              Checkout POS
            </Link>
            <Link to="/admin" style={{ color: "#c084fc", fontSize: "14px", fontWeight: "700" }}>
              🔐 Admin Dashboard
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center", paddingTop: "20px", fontSize: "12px", color: "#64748b" }}>
          © 2026 FreshMart Supermarket Basket
        </div>
      </footer>
    </div>
  );
}

export default Cart;
