import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { useMartProducts } from "../utils/products";
import ShopHeader from "../components/ShopHeader";
import ShopFooter from "../components/ShopFooter";
import QuickViewModal from "../components/QuickViewModal";

export default function Products() {
  const navigate = useNavigate();
  const { products, deleteProduct, resetProducts, categories } = useMartProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [toast, setToast] = useState(null);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Card quantity steppers: map of { [productId]: quantity }
  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (e, productId, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    setToast({
      message: `✓ បានបន្ថែម "${product.nameKh || product.name}" (x${qty}) ទៅកន្ត្រក! 🛒`,
    });
    setTimeout(() => setToast(null), 2800);
  };

  const handleBuyNow = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    navigate("/checkout");
  };

  const handleDeleteProduct = (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`តើអ្នកពិតជាចង់លុបទំនិញ "${name}" ចេញពីកាតាឡុកមែនទេ?`)) {
      deleteProduct(id);
      setToast({
        message: `🗑️ បានលុបទំនិញ "${name}" រួចរាល់។`,
      });
      setTimeout(() => setToast(null), 2500);
    }
  };

  let filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      (product.name && product.name.toLowerCase().includes(query)) ||
      (product.nameKh && product.nameKh.toLowerCase().includes(query)) ||
      (product.barcode && product.barcode.includes(query)) ||
      (product.unit && product.unit.toLowerCase().includes(query));

    return matchCategory && matchSearch;
  });

  if (sort === "low") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "high") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === "name") {
    filteredProducts.sort((a, b) =>
      (a.nameKh || a.name).localeCompare(b.nameKh || b.name)
    );
  } else if (sort === "discount") {
    filteredProducts.sort((a, b) => {
      const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discB - discA;
    });
  }

  return (
    <div className="home-page">
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background: "#0f172a",
            color: "#ffffff",
            padding: "14px 22px",
            borderRadius: "14px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            gap: "14px",
            border: "1px solid #334155",
            animation: "slideInUp 0.3s ease-out",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "700" }}>{toast.message}</div>
          <Link
            to="/cart"
            style={{
              padding: "6px 14px",
              background: "#059669",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            មើលកន្ត្រក →
          </Link>
        </div>
      )}

      {/* Header */}
      <ShopHeader
        searchQuery={search}
        setSearchQuery={setSearch}
        onProductAdded={(newProd) => {
          setToast({
            message: `🎉 បានបន្ថែមទំនិញថ្មី "${newProd.nameKh || newProd.name}" ចូលកាតាឡុកជោគជ័យ!`,
          });
          setTimeout(() => setToast(null), 3500);
        }}
      />

      {/* Catalog Banner */}
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
            OFFICIAL SUPERMARKET CATALOG
          </span>
          <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: "900", margin: "8px 0" }}>
            កាតាឡុកទំនិញក្នុងម៉ាត <span>({products.length} មុខ)</span>
          </h1>
          <p style={{ color: "#e2e8f0", fontSize: "14px", maxWidth: "600px", margin: "0 auto" }}>
            ស្វែងរកទំនិញស្រស់ៗ ភេសជ្ជៈ អាហារសម្រន់ និងគ្រឿងប្រើប្រាស់ប្រចាំថ្ងៃ ជាមួយរូបភាពពិត និងតម្លៃសមរម្យ។
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
            <strong style={{ color: "#ffffff" }}>កាតាឡុកទំនិញ ({filteredProducts.length})</strong>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <section style={{ padding: "36px 24px 70px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "12px",
              marginBottom: "24px",
              scrollbarWidth: "none",
            }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === "all"
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border: isSelected ? "none" : "1.5px solid #e2e8f0",
                    background: isSelected ? "linear-gradient(135deg, #059669, #047857)" : "#ffffff",
                    color: isSelected ? "#ffffff" : "#334155",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: isSelected ? "0 4px 12px rgba(5,150,105,0.25)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameKh}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      background: isSelected ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                      color: isSelected ? "#ffffff" : "#64748b",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              background: "#ffffff",
              padding: "16px 20px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              marginBottom: "28px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#64748b" }}>
              បង្ហាញ <strong style={{ color: "#0f172a" }}>{filteredProducts.length}</strong> ទំនិញក្នុងស្តុក
              {search && <span> សម្រាប់ពាក្យ: "{search}"</span>}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12.5px", fontWeight: "700", color: "#64748b" }}>តម្រៀប:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  color: "#334155",
                  outline: "none",
                }}
              >
                <option value="default">លំនាំដើម</option>
                <option value="low">តម្លៃ: ទាប ទៅ ខ្ពស់</option>
                <option value="high">តម្លៃ: ខ្ពស់ ទៅ ទាប</option>
                <option value="discount">បញ្ចុះតម្លៃច្រើនជាងគេ</option>
                <option value="name">ឈ្មោះទំនិញ (A-Z)</option>
              </select>

              <button
                type="button"
                onClick={resetProducts}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#64748b",
                  fontWeight: "600",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                🔄 Reset ទំនិញដើម
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#ffffff",
                borderRadius: "20px",
                border: "1.5px dashed #cbd5e1",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              <div style={{ fontSize: "52px", marginBottom: "14px" }}>🔍</div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>
                រកមិនឃើញទំនិញក្នុងផ្នែកនេះទេ
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
                សូមសាកល្បងជ្រើសរើសប្រភេទផ្សេង ឬសម្អាតការស្វែងរក
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearch("");
                }}
                style={{
                  padding: "10px 22px",
                  background: "#059669",
                  color: "#ffffff",
                  borderRadius: "10px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                មើលទំនិញទាំងអស់
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
                gap: "22px",
              }}
            >
              {filteredProducts.map((product) => {
                const approxRiel = Math.round(product.price * 4100).toLocaleString();
                const cardQty = quantities[product.id] || 1;

                const discountPercent =
                  product.originalPrice && product.originalPrice > product.price
                    ? Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) *
                          100
                      )
                    : null;

                return (
                  <div key={product.id} className="mart-product-card">
                    {/* Image Area */}
                    <div
                      style={{
                        height: "210px",
                        position: "relative",
                        background: "#f1f5f9",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() => setQuickViewProduct(product)}
                      title="ចុចដើម្បីមើលលម្អិត (Quick View)"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80";
                        }}
                      />

                      {product.badge && (
                        <span
                          style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            background: "#059669",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: "800",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            boxShadow: "0 4px 10px rgba(5, 150, 105, 0.3)",
                          }}
                        >
                          {product.badge}
                        </span>
                      )}

                      {discountPercent && (
                        <span
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "#ef4444",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: "900",
                            padding: "3px 8px",
                            borderRadius: "14px",
                          }}
                        >
                          -{discountPercent}%
                        </span>
                      )}

                      {/* Stock & Barcode Bottom Bar */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          left: "8px",
                          right: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {product.barcode && (
                          <span
                            style={{
                              background: "rgba(255, 255, 255, 0.92)",
                              backdropFilter: "blur(4px)",
                              color: "#475569",
                              fontSize: "10px",
                              fontFamily: "monospace",
                              fontWeight: "700",
                              padding: "2px 6px",
                              borderRadius: "6px",
                            }}
                          >
                            BAR: {product.barcode}
                          </span>
                        )}

                        <span
                          style={{
                            background: "rgba(15, 23, 42, 0.8)",
                            backdropFilter: "blur(4px)",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: "700",
                            padding: "2px 7px",
                            borderRadius: "6px",
                          }}
                        >
                          ស្តុក: {product.stock || 50}
                        </span>
                      </div>

                      {product.isCustom && (
                        <button
                          type="button"
                          onClick={(e) =>
                            handleDeleteProduct(e, product.id, product.nameKh || product.name)
                          }
                          title="លុបទំនិញនេះ"
                          style={{
                            position: "absolute",
                            top: "44px",
                            right: "12px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "1px solid #fca5a5",
                            borderRadius: "8px",
                            padding: "3px 8px",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    {/* Details */}
                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#059669",
                              background: "#ecfdf5",
                              padding: "2px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            {product.categoryLabel || product.category}
                          </span>

                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#64748b",
                              background: "#f1f5f9",
                              padding: "2px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            📦 {product.unit || "កញ្ចប់"}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontSize: "15px",
                            fontWeight: "800",
                            color: "#0f172a",
                            lineHeight: "1.35",
                            marginBottom: "4px",
                            cursor: "pointer",
                          }}
                          onClick={() => setQuickViewProduct(product)}
                        >
                          {product.nameKh || product.name}
                        </h3>

                        {product.nameKh && product.name && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginBottom: "10px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.name}
                          </div>
                        )}
                      </div>

                      {/* Pricing, Stepper & Action Buttons */}
                      <div style={{ marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: "10px",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                              <span style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a" }}>
                                ${Number(product.price).toFixed(2)}
                              </span>
                              {product.originalPrice &&
                                product.originalPrice > product.price && (
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#94a3b8",
                                      textDecoration: "line-through",
                                    }}
                                  >
                                    ${Number(product.originalPrice).toFixed(2)}
                                  </span>
                                )}
                            </div>
                            <div style={{ fontSize: "11px", color: "#059669", fontWeight: "600" }}>
                              ≈ {approxRiel} ៛
                            </div>
                          </div>

                          <div style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "700" }}>
                            ★ {product.rating || 4.9} ({product.reviews || 95})
                          </div>
                        </div>

                        {/* Card Quantity Stepper & Quick View button */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              background: "#f1f5f9",
                              borderRadius: "8px",
                              padding: "2px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => handleQtyChange(e, product.id, -1)}
                              style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "6px",
                                border: "none",
                                background: "#ffffff",
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
                            <span style={{ padding: "0 10px", fontSize: "13px", fontWeight: "800" }}>
                              {cardQty}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleQtyChange(e, product.id, 1)}
                              style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "6px",
                                border: "none",
                                background: "#ffffff",
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

                          <button
                            type="button"
                            onClick={() => setQuickViewProduct(product)}
                            style={{
                              background: "none",
                              border: "1px solid #cbd5e1",
                              color: "#475569",
                              padding: "5px 10px",
                              borderRadius: "8px",
                              fontSize: "11.5px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            👁️ មើលលម្អិត
                          </button>
                        </div>

                        {/* Buy Now & Add to Cart */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={(e) => handleBuyNow(e, product)}
                            style={{
                              padding: "9px 8px",
                              background: "#0f172a",
                              color: "#ffffff",
                              borderRadius: "10px",
                              border: "none",
                              fontWeight: "700",
                              fontSize: "12.5px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <span>⚡</span>
                            <span>ទិញភ្លាម</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            style={{
                              padding: "9px 8px",
                              background: "#059669",
                              color: "#ffffff",
                              borderRadius: "10px",
                              border: "none",
                              fontWeight: "700",
                              fontSize: "12.5px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <span>🛒</span>
                            <span>+ កន្ត្រក</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <ShopFooter />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onBuyNow={handleBuyNow}
        onAddedToCart={(prod, qty) => {
          setToast({
            message: `✓ បានបន្ថែម "${prod.nameKh || prod.name}" (x${qty}) ទៅកន្ត្រក! 🛒`,
          });
          setTimeout(() => setToast(null), 2800);
        }}
      />
    </div>
  );
}
