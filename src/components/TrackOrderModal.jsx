import React, { useState } from "react";

export default function TrackOrderModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setHasSearched(true);
    // Realistic simulation of tracked order
    setTrackedOrder({
      orderNumber: clean.toUpperCase().startsWith("ORD-") ? clean.toUpperCase() : `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: "Sokun Theara",
      phone: clean.match(/^[0-9]+$/) ? clean : "097 993 7524",
      address: "Street 271, Toul Kork, Phnom Penh",
      status: "out_for_delivery", // "confirmed", "packing", "out_for_delivery", "delivered"
      placedAt: "ថ្ងៃនេះ, ម៉ោង 2:15 រសៀល",
      estDelivery: "25 - 30 នាទី (ម៉ោង 2:45 រសៀល)",
      driverName: "Borey Sok (អ្នកដឹក Express)",
      driverPhone: "012 334 556",
      vehicle: "Honda Dream 125 (ភ្នំពេញ 1AB-8821)",
      items: [
        { name: "កូកាកូឡា Coca-Cola Classic Can", qty: 2, price: 0.75 },
        { name: "ទឹកដោះគោស្រស់ Meiji Fresh Milk", qty: 1, price: 2.80 },
        { name: "ផ្លែប៉ោមក្រហម Fuji Apples (1kg)", qty: 1, price: 3.20 },
      ],
      total: 7.50,
      payment: "Bakong KHQR (ទូទាត់រួចរាល់ ✓)",
    });
  };

  const handleQuickSample = () => {
    setQuery("0979937524");
    setHasSearched(true);
    setTrackedOrder({
      orderNumber: "ORD-2026-9021",
      customerName: "Sokun Theara",
      phone: "097 993 7524",
      address: "Street 271, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh",
      status: "out_for_delivery",
      placedAt: "ថ្ងៃនេះ, ម៉ោង 2:15 រសៀល",
      estDelivery: "ប្រហែល 12 នាទីទៀត (ម៉ោង 2:45 រសៀល)",
      driverName: "Channa Kim (FreshMart Express Rider)",
      driverPhone: "012 889 900",
      vehicle: "Honda Wave 110 (ភ្នំពេញ 1BC-7729)",
      items: [
        { name: "កូកាកូឡា Coca-Cola Classic Can", qty: 2, price: 0.75 },
        { name: "ទឹកដោះគោស្រស់ Meiji Fresh Milk", qty: 1, price: 2.80 },
        { name: "ផ្លែប៉ោមក្រហម Fuji Apples (1kg)", qty: 1, price: 3.20 },
      ],
      total: 7.50,
      payment: "Bakong KHQR (ទូទាត់រួចរាល់ ✓)",
    });
  };

  return (
    <div className="fm-modal-backdrop" onClick={onClose}>
      <div
        className="fm-modal-card"
        style={{ maxWidth: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fm-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "26px" }}>📦</span>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                តាមដានការបញ្ជាទិញ (Live Order Tracking)
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                ពិនិត្យស្ថានភាពកញ្ចប់ទំនិញស្រស់ៗ និងទីតាំងអ្នកដឹកជញ្ជូនជាក់ស្តែង
              </p>
            </div>
          </div>
          <button type="button" className="fm-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="បញ្ចូលលេខទូរស័ព្ទ ឬលេខកូដកុម្ម៉ង់ (ឧ. 0979937524 ឬ ORD-2026-9021)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1.5px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 20px",
                background: "#059669",
                color: "#ffffff",
                borderRadius: "12px",
                border: "none",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              🔍 ពិនិត្យ
            </button>
          </form>

          {!hasSearched && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px" }}>
                ចង់សាកល្បងមើលស្ថានភាពការដឹកជញ្ជូនគំរូ?
              </p>
              <button
                type="button"
                onClick={handleQuickSample}
                style={{
                  background: "#ecfdf5",
                  color: "#059669",
                  border: "1px solid #a7f3d0",
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                ⚡ ចុចដើម្បីពិនិត្យការបញ្ជាទិញគំរូ (Demo Order: 0979937524)
              </button>
            </div>
          )}

          {hasSearched && trackedOrder && (
            <div>
              {/* Order Status Badge & Meta */}
              <div
                style={{
                  padding: "16px",
                  background: "#f0fdf4",
                  borderRadius: "14px",
                  border: "1px solid #bbf7d0",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#059669" }}>
                    កូដកុម្ម៉ង់: <strong>{trackedOrder.orderNumber}</strong>
                  </span>
                  <span
                    style={{
                      background: "#16a34a",
                      color: "#fff",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "800",
                    }}
                  >
                    🛵 កំពុងដឹកជញ្ជូន
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#334155" }}>
                  📍 <strong>អាសយដ្ឋានដឹក:</strong> {trackedOrder.address}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                  ⏱️ <strong>ពេលវេលាមកដល់ប៉ាន់ស្មាន:</strong>{" "}
                  <span style={{ color: "#059669", fontWeight: "800" }}>{trackedOrder.estDelivery}</span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div style={{ margin: "24px 0", position: "relative" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    textAlign: "center",
                  }}
                >
                  {/* Step 1 */}
                  <div>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#059669",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 8px",
                        fontWeight: "800",
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#0f172a" }}>បានទទួល</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>2:15 PM</div>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#059669",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 8px",
                        fontWeight: "800",
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#0f172a" }}>វេចខ្ចប់ស្រស់ៗ</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>2:25 PM</div>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#059669",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 8px",
                        boxShadow: "0 0 0 4px rgba(5, 150, 105, 0.25)",
                        animation: "pulse 1.8s infinite",
                      }}
                    >
                      🛵
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#059669" }}>កំពុងធ្វើដំណើរ</div>
                    <div style={{ fontSize: "10px", color: "#059669" }}>បច្ចុប្បន្ន</div>
                  </div>

                  {/* Step 4 */}
                  <div>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#e2e8f0",
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 8px",
                        fontWeight: "700",
                      }}
                    >
                      4
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8" }}>ដឹកដល់ដៃ</div>
                    <div style={{ fontSize: "10px", color: "#94a3b8" }}>~ 2:45 PM</div>
                  </div>
                </div>
              </div>

              {/* Driver Card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "#059669",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    🛵
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                      {trackedOrder.driverName}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      {trackedOrder.vehicle}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${trackedOrder.driverPhone.replace(/\s+/g, "")}`}
                  style={{
                    padding: "8px 14px",
                    background: "#ecfdf5",
                    color: "#059669",
                    borderRadius: "8px",
                    border: "1px solid #a7f3d0",
                    fontSize: "12px",
                    fontWeight: "700",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  📞 {trackedOrder.driverPhone}
                </a>
              </div>

              {/* Order Items Summary */}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                  ទំនិញក្នុងកញ្ចប់:
                </div>
                {trackedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "#334155",
                      padding: "4px 0",
                    }}
                  >
                    <span>
                      {it.name} <strong style={{ color: "#059669" }}>x{it.qty}</strong>
                    </span>
                    <span>${(it.price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#0f172a",
                    marginTop: "8px",
                    paddingTop: "8px",
                    borderTop: "1px dashed #e2e8f0",
                  }}
                >
                  <span>សរុប (Total Paid):</span>
                  <span style={{ color: "#059669" }}>${trackedOrder.total.toFixed(2)} ({trackedOrder.payment})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fm-modal-footer">
          <button type="button" className="fm-btn-outline" onClick={onClose}>
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
}
