import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../utils/cart";
import ShopHeader from "../components/ShopHeader";
import ShopFooter from "../components/ShopFooter";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, totalQuantity, subtotal, updateCartQuantity, removeFromCart, clearCart } =
    useCart();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  const FREE_SHIPPING_THRESHOLD = 15;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freePercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const shipping = cart.length > 0 ? (isFreeShipping ? 0 : 1.5) : 0;
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const total = Math.max(0, subtotal - discountAmount + shipping);
  const approxTotalRiel = Math.round(total * 4100).toLocaleString();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === "STYLE20" || clean === "FRESH20") {
      setDiscountPercent(20);
      setCouponMessage({ type: "success", text: "✓ បានអនុវត្តការបញ្ចុះតម្លៃ 20% រួចរាល់!" });
    } else if (clean === "FREE" || clean === "FRESH10") {
      setDiscountPercent(10);
      setCouponMessage({ type: "success", text: "✓ បានអនុវត្តការបញ្ចុះតម្លៃ 10% រួចរាល់!" });
    } else {
      setDiscountPercent(0);
      setCouponMessage({ type: "error", text: "✕ លេខកូដមិនត្រឹមត្រូវ។ សាកល្បង: STYLE20 ឬ FREE" });
    }
  };

  return (
    <div className="home-page">
      {/* Header */}
      <ShopHeader />

      {/* Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
          color: "#ffffff",
          padding: "40px 24px 36px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <span
            style={{
              color: "#a7f3d0",
              fontWeight: "800",
              fontSize: "11px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            YOUR SHOPPING BASKET
          </span>
          <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: "900", margin: "8px 0" }}>
            កន្ត្រកទំនិញរបស់អ្នក <span>({totalQuantity} ឯកតា)</span>
          </h1>
          <p style={{ color: "#e2e8f0", fontSize: "14px", maxWidth: "600px", margin: "0 auto" }}>
            ពិនិត្យមុខទំនិញដែលបានជ្រើសរើស មុនពេលបន្តទៅកាន់ Checkout & ទូទាត់តាម KHQR ឬសាច់ប្រាក់។
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              fontSize: "13px",
            }}
          >
            <Link to="/" style={{ color: "#a7f3d0", textDecoration: "none" }}>
              ទំព័រដើម
            </Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <strong style={{ color: "#ffffff" }}>កន្ត្រកទំនិញ</strong>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section style={{ padding: "36px 24px 70px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Free Shipping Progress Meter */}
          {cart.length > 0 && (
            <div
              style={{
                background: isFreeShipping ? "#ecfdf5" : "#ffffff",
                border: isFreeShipping ? "1.5px solid #a7f3d0" : "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "16px 22px",
                marginBottom: "26px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13.5px",
                  fontWeight: "700",
                  color: isFreeShipping ? "#065f46" : "#334155",
                  marginBottom: "8px",
                }}
              >
                {isFreeShipping ? (
                  <span>🎉 អបអរសាទរ! ការកុម្ម៉ង់របស់អ្នកទទួលបាន <strong>ការដឹកជញ្ជូនឥតគិតថ្លៃ</strong>!</span>
                ) : (
                  <span>
                    🚚 ទិញថែមតែ <strong style={{ color: "#059669" }}>${remainingForFree.toFixed(2)}</strong> ទៀត ដើម្បីទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ!
                  </span>
                )}
                <span>{freePercent}%</span>
              </div>

              <div
                style={{
                  height: "8px",
                  width: "100%",
                  background: "#e2e8f0",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${freePercent}%`,
                    background: isFreeShipping ? "#10b981" : "linear-gradient(90deg, #059669, #34d399)",
                    borderRadius: "10px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* Heading */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
                មុខទំនិញក្នុងកន្ត្រក ({cart.length} មុខ)
              </h2>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                សរុប {totalQuantity} ឯកតាក្នុងកន្ត្រក
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                    borderRadius: "10px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  🗑️ សម្អាតកន្ត្រក
                </button>
              )}

              <Link
                to="/products"
                style={{
                  color: "#059669",
                  fontWeight: "700",
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                ← បន្តទិញទំនិញក្នុងម៉ាត
              </Link>
            </div>
          </div>

          {/* Cart Items or Empty View */}
          {cart.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "70px 20px",
                background: "#ffffff",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🧺</div>
              <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", marginBottom: "8px" }}>
                កន្ត្រកទំនិញរបស់អ្នកទទេស្អាត
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px" }}>
                មិនទាន់មានទំនិញក្នុងកន្ត្រកនៅឡើយទេ។ សូមជ្រើសរើសទំនិញស្រស់ៗដែលអ្នកពេញចិត្ត!
              </p>
              <Link
                to="/products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 28px",
                  background: "#059669",
                  color: "#ffffff",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(5,150,105,0.25)",
                }}
              >
                ជ្រើសរើសទំនិញក្នុងម៉ាតឥឡូវនេះ →
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Product List */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}
              >
                <div className="cart-table-heading" style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <span>ទំនិញ (PRODUCT)</span>
                  <span>តម្លៃឯកតា (PRICE)</span>
                  <span>ចំនួន (QUANTITY)</span>
                  <span>សរុប (TOTAL)</span>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="cart-item"
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <div className="cart-product">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "72px",
                          height: "72px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          background: "#f1f5f9",
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
                            fontWeight: "800",
                            color: "#059669",
                            background: "#ecfdf5",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.category} {item.unit ? `• ${item.unit}` : ""}
                        </span>
                        <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "3px 0 4px" }}>
                          {item.name}
                        </h4>
                        {item.sku && (
                          <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace", marginBottom: "4px" }}>
                            BAR: {item.sku}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            color: "#ef4444",
                            fontWeight: "700",
                            fontSize: "12px",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          ✕ លុបចេញ
                        </button>
                      </div>
                    </div>

                    <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>
                      ${Number(item.price).toFixed(2)}
                    </div>

                    <div className="cart-quantity">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span style={{ padding: "0 10px", fontWeight: "800", fontSize: "14px" }}>
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div style={{ fontWeight: "900", color: "#059669", fontSize: "15px" }}>
                      ${(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary & Coupon */}
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Coupon Box */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    padding: "20px",
                  }}
                >
                  <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>
                    🎟️ លេខកូដបញ្ចុះតម្លៃ (Voucher Coupon)
                  </h4>
                  <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="បញ្ចូលកូដ (ឧ. STYLE20)..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "10px 16px",
                        background: "#0f172a",
                        color: "#ffffff",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      ប្រើប្រាស់
                    </button>
                  </form>

                  {couponMessage && (
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: couponMessage.type === "success" ? "#059669" : "#dc2626",
                      }}
                    >
                      {couponMessage.text}
                    </div>
                  )}

                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "8px" }}>
                    សាកល្បង: <code style={{ color: "#059669" }}>STYLE20</code> (បញ្ចុះ 20%) ឬ <code style={{ color: "#059669" }}>FREE</code> (បញ្ចុះ 10%)
                  </div>
                </div>

                {/* Summary Card */}
                <div className="cart-summary">
                  <h3 style={{ fontSize: "17px", fontWeight: "900", color: "#0f172a", marginBottom: "16px" }}>
                    សង្ខេបការបញ្ជាទិញ (Order Summary)
                  </h3>

                  <div className="cart-summary-row">
                    <span>តម្លៃទំនិញសរុប (Subtotal):</span>
                    <strong>${subtotal.toFixed(2)}</strong>
                  </div>

                  {discountPercent > 0 && (
                    <div className="cart-summary-row" style={{ color: "#059669" }}>
                      <span>បញ្ចុះតម្លៃ ({discountPercent}%):</span>
                      <strong>-${discountAmount.toFixed(2)}</strong>
                    </div>
                  )}

                  <div className="cart-summary-row">
                    <span>ថ្លៃដឹកជញ្ជូន (Delivery Fee):</span>
                    {shipping === 0 ? (
                      <span style={{ color: "#059669", fontWeight: "800" }}>ឥតគិតថ្លៃ (FREE)</span>
                    ) : (
                      <strong>${shipping.toFixed(2)}</strong>
                    )}
                  </div>

                  <div className="cart-summary-total">
                    <div>
                      <span>សរុបរួម (Grand Total):</span>
                      <div style={{ fontSize: "12px", color: "#059669", fontWeight: "700" }}>
                        ≈ {approxTotalRiel} ៛ (រៀល)
                      </div>
                    </div>
                    <span style={{ fontSize: "26px", color: "#0f172a", fontWeight: "900" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    className="cart-checkout"
                  >
                    <span>🧾 បន្តទៅ Checkout POS →</span>
                  </button>

                  {/* Payment Icons */}
                  <div style={{ textAlign: "center", marginTop: "18px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "6px" }}>
                      ទូទាត់ដោយសុវត្ថិភាព 100% តាម
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span className="fm-payment-badge">Bakong KHQR</span>
                      <span className="fm-payment-badge">ABA Mobile</span>
                      <span className="fm-payment-badge">Cash on Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <ShopFooter />
    </div>
  );
}
