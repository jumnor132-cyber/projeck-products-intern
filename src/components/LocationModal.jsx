import React from "react";

const PHNOM_PENH_DISTRICTS = [
  { id: "tk", nameKh: "ខណ្ឌទួលគោក (Toul Kork)", estTime: "15 - 25 នាទី", fee: "ឥតគិតថ្លៃ (លើ $15)" },
  { id: "bkk", nameKh: "ខណ្ឌបឹងកេងកង (BKK1)", estTime: "20 - 30 នាទី", fee: "ឥតគិតថ្លៃ (លើ $15)" },
  { id: "dp", nameKh: "ខណ្ឌដូនពេញ (Daun Penh)", estTime: "20 - 30 នាទី", fee: "ឥតគិតថ្លៃ (លើ $15)" },
  { id: "ss", nameKh: "ខណ្ឌសែនសុខ (Sen Sok)", estTime: "25 - 35 នាទី", fee: "ឥតគិតថ្លៃ (លើ $15)" },
  { id: "ca", nameKh: "ខណ្ឌច្បារអំពៅ (Chbar Ampov)", estTime: "30 - 45 នាទី", fee: "ឥតគិតថ្លៃ (លើ $15)" },
  { id: "mc", nameKh: "ខណ្ឌមានជ័យ (Mean Chey)", estTime: "25 - 35 នាទី", fee: "ឥតគិតថ្លៃ (លើ $15)" },
  { id: "ckm", nameKh: "ខណ្ឌចំការមន (Chamkarmon)", estTime: "20 - 30 នាទី", fee: "ឥតគិតថ្លៃ (លើ $15)" },
  { id: "rsk", nameKh: "ខណ្ឌឫស្សីកែវ (Russey Keo)", estTime: "25 - 40 នាទី", fee: "ឥតគិតថ្លៃ (លើ $15)" },
];

export default function LocationModal({ isOpen, onClose, selectedDistrict, onSelectDistrict }) {
  if (!isOpen) return null;

  return (
    <div className="fm-modal-backdrop" onClick={onClose}>
      <div
        className="fm-modal-card"
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fm-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📍</span>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                ជ្រើសរើសទីតាំងដឹកជញ្ជូន
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                ជ្រើសរើសខណ្ឌរបស់អ្នកក្នុងរាជធានីភ្នំពេញ ដើម្បីទទួលបានសេវាដឹកលឿនបំផុត
              </p>
            </div>
          </div>
          <button type="button" className="fm-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              background: "#ecfdf5",
              borderRadius: "12px",
              border: "1px solid #a7f3d0",
              marginBottom: "18px",
              fontSize: "13px",
              color: "#065f46",
            }}
          >
            <span>⚡</span>
            <span>
              <strong>FreshMart Express:</strong> បញ្ជាទិញឥឡូវនេះ ដឹកជូនភ្លាមៗក្នុងរយៈពេល <strong>30 នាទី</strong>!
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto" }}>
            {PHNOM_PENH_DISTRICTS.map((district) => {
              const isSelected = selectedDistrict === district.nameKh;
              return (
                <div
                  key={district.id}
                  onClick={() => {
                    onSelectDistrict(district.nameKh);
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: isSelected ? "2px solid #059669" : "1px solid #e2e8f0",
                    background: isSelected ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  className="fm-district-item"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: isSelected ? "#059669" : "#f1f5f9",
                        color: isSelected ? "#ffffff" : "#475569",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      {isSelected ? "✓" : "📍"}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                        {district.nameKh}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        🚚 រយៈពេលប៉ាន់ស្មាន: {district.estTime}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#059669",
                      background: "#ecfdf5",
                      padding: "4px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    {district.fee}
                  </span>
                </div>
              );
            })}
          </div>
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
