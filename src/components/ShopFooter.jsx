import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ShopFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="fm-footer">
      {/* 1. Accepted Payments & Service Badges */}
      <div className="fm-footer-trust-bar">
        <div className="fm-footer-trust-inner">
          <div className="fm-trust-item">
            <span className="fm-trust-icon">🚚</span>
            <div>
              <strong>ដឹកជញ្ជូនរហ័ស 30 នាទី</strong>
              <small>សេវាដឹកក្នុងរាជធានីភ្នំពេញ</small>
            </div>
          </div>

          <div className="fm-trust-item">
            <span className="fm-trust-icon">🥗</span>
            <div>
              <strong>ស្រស់ៗ 100% គុណភាពខ្ពស់</strong>
              <small>ធានាប្តូរប្រាក់វិញប្រសិនមិនពេញចិត្ត</small>
            </div>
          </div>

          <div className="fm-trust-item">
            <span className="fm-trust-icon">📱</span>
            <div>
              <strong>ស្កេនទូទាត់ Bakong KHQR</strong>
              <small>ABA, Wing, ACLEDA គ្រប់ធនាគារ</small>
            </div>
          </div>

          <div className="fm-trust-item">
            <span className="fm-trust-icon">💬</span>
            <div>
              <strong>បម្រើអតិថិជន 24/7</strong>
              <small>Hotline & Telegram Hotline ផ្ទាល់</small>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="fm-footer-main">
        <div className="fm-footer-grid">
          {/* Col 1: Brand Info */}
          <div>
            <div className="fm-brand-logo" style={{ marginBottom: "16px" }}>
              <div className="fm-brand-icon">🛒</div>
              <div>
                <div className="fm-brand-title" style={{ color: "#ffffff" }}>
                  Fresh<span style={{ color: "#34d399" }}>Mart</span>
                </div>
                <div className="fm-brand-subtitle" style={{ color: "#94a3b8" }}>
                  SUPERMARKET & EXPRESS POS
                </div>
              </div>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.7", marginBottom: "18px" }}>
              ផ្សារទំនើប និងម៉ាតទំនិញស្រស់ៗឈានមុខគេ ផ្គត់ផ្គង់ភេសជ្ជៈ ផ្លែឈើ នំចំណី និងគ្រឿងទេសគុណភាពខ្ពស់ ដឹកជូនដល់មាត់ទ្វាររហ័សទាន់ចិត្ត។
            </p>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <a
                href="https://t.me/+855979937524"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 14px",
                  background: "#1e293b",
                  color: "#38bdf8",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid #334155",
                }}
              >
                <span>✈️</span> Telegram Channel
              </a>
              <span style={{ color: "#64748b", fontSize: "12px" }}>• 097 993 7524</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="fm-footer-col-title">តំណភ្ជាប់រហ័ស</h4>
            <ul className="fm-footer-links">
              <li>
                <Link to="/">🏠 ទំព័រដើម (Home)</Link>
              </li>
              <li>
                <Link to="/products">🛍️ ទំនិញទាំងអស់ (Catalog)</Link>
              </li>
              <li>
                <Link to="/cart">🛒 កន្ត្រកទំនិញ (Shopping Cart)</Link>
              </li>
              <li>
                <Link to="/checkout">🧾 Checkout POS & វិក្កយបត្រ</Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: "#c084fc", fontWeight: "700" }}>
                  🔐 Admin Dashboard (PIN: 1234)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Supermarket Branches */}
          <div>
            <h4 className="fm-footer-col-title">សាខាម៉ាតនៅភ្នំពេញ</h4>
            <ul className="fm-footer-branches">
              <li>
                <strong>📍 សាខា ១: ទួលគោក</strong>
                <p>ផ្លូវ 289, សង្កាត់បឹងកក់ ២, ខណ្ឌទួលគោក</p>
              </li>
              <li>
                <strong>📍 សាខា ២: បឹងកេងកង ១</strong>
                <p>ផ្លូវ 57 កែង 302, ខណ្ឌបឹងកេងកង</p>
              </li>
              <li>
                <strong>📍 សាខា ៣: សែនសុខ</strong>
                <p>មហាវិថី ហាណូយ, ខណ្ឌសែនសុខ</p>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Payments */}
          <div>
            <h4 className="fm-footer-col-title">ទទួលប្រូម៉ូសិនពិសេស</h4>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6", marginBottom: "14px" }}>
              ចុះឈ្មោះអ៊ីមែលដើម្បីទទួលបានលេខកូដបញ្ចុះតម្លៃ 20% រៀងរាល់ចុងសប្តាហ៍!
            </p>

            <form onSubmit={handleSubscribe} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #334155",
                    background: "#1e293b",
                    color: "#ffffff",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    background: "#059669",
                    color: "#ffffff",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: "800",
                    fontSize: "12px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  ចុះឈ្មោះ
                </button>
              </div>
              {subscribed && (
                <div style={{ color: "#34d399", fontSize: "12px", marginTop: "8px", fontWeight: "700" }}>
                  ✓ អរគុណ! អ្នកបានចុះឈ្មោះទទួលព័ត៌មានដោយជោគជ័យ!
                </div>
              )}
            </form>

            <div style={{ marginTop: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                ដៃគូទូទាត់ផ្លូវការ
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                <span className="fm-payment-badge">🇰🇭 Bakong KHQR</span>
                <span className="fm-payment-badge">ABA Pay</span>
                <span className="fm-payment-badge">Wing Bank</span>
                <span className="fm-payment-badge">TrueMoney</span>
                <span className="fm-payment-badge">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright & Server Info */}
      <div className="fm-footer-bottom">
        <div className="fm-footer-bottom-inner">
          <div>
            © 2026 FreshMart Supermarket & Express POS System. រក្សាសិទ្ធិគ្រប់យ៉ាង។
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <span>Backend: PHP REST API</span>
            <span>•</span>
            <span>Database: MySQL (Localhost / XAMPP)</span>
            <span>•</span>
            <span style={{ color: "#34d399" }}>Security Grade A+ ✓</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
