import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, addToCart } from "../utils/cart";
import { useMartProducts } from "../utils/products";
import AddProductModal from "../components/AddProductModal";
import "../index.css";

function Products() {
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const { products, deleteProduct, resetProducts, categories } = useMartProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [toast, setToast] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setToast({
      message: `✓ បានបន្ថែម "${product.nameKh || product.name}" ទៅកន្ត្រក! 🛒`,
    });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate("/checkout");
  };

  const handleProductAdded = (newProd) => {
    setToast({
      message: `🎉 បានបន្ថែមទំនិញថ្មី "${newProd.nameKh || newProd.name}" ចូលកាតាឡុកជោគជ័យ!`,
    });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleDeleteProduct = (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`តើអ្នកពិតជាចង់លុបទំនិញ "${name}" ចេញពីកាតាឡុកមែនទេ?`)) {
      deleteProduct(id);
      setToast({
        message: `🗑️ បានលុបទំនិញ "${name}" រួចរាល់។`,
      });
      setTimeout(() => {
        setToast(null);
      }, 2500);
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
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filteredProducts.sort((a, b) =>
      (a.nameKh || a.name).localeCompare(b.nameKh || b.name)
    );
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
          <div style={{ fontSize: "14px", fontWeight: "600" }}>{toast.message}</div>
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
            }}
          >
            មើលកន្ត្រក →
          </Link>
        </div>
      )}

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
          <Link to="/products" className="active" style={{ color: "#059669", fontWeight: "700" }}>
            ទំនិញទាំងអស់ ({products.length})
          </Link>
          <Link
            to="/cart"
            className="shop-cart-nav"
            style={{
              position: "relative",
              padding: "8px 14px",
              background: "#ecfdf5",
              color: "#059669",
              borderRadius: "10px",
              fontWeight: "700",
              border: "1px solid #a7f3d0",
            }}
          >
            កន្ត្រក 🛒
            {totalQuantity > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#ef4444",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "2px 7px",
                  borderRadius: "20px",
                }}
              >
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link
            to="/checkout"
            style={{
              color: "#059669",
              fontWeight: "700",
              fontSize: "13px",
              padding: "6px 12px",
              background: "#f0fdf4",
              borderRadius: "8px",
              border: "1px solid #bbf7d0",
            }}
          >
            🧾 Checkout POS
          </Link>
          <Link
            to="/admin"
            style={{
              color: "#7c3aed",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              background: "#f5f3ff",
              borderRadius: "8px",
              border: "1px solid #ddd6fe",
              fontSize: "13px",
            }}
            title="ផ្ទាំង Admin"
          >
            🔐 Admin
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 20px",
            background: "linear-gradient(135deg, #059669, #047857)",
            color: "#ffffff",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "800",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(5, 150, 105, 0.25)",
          }}
        >
          <span>➕</span>
          <span>ថែមអីវាន់ / Add Item</span>
        </button>
      </header>

      {/* Catalog Banner */}
      <section
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
          SUPERMARKET INVENTORY & POS
        </span>
        <h1 style={{ fontSize: "38px", fontWeight: "900", margin: "8px 0 12px", letterSpacing: "-0.5px" }}>
          បញ្ជីទំនិញក្នុងម៉ាត (Mart Product Catalog)
        </h1>
        <p style={{ color: "#e2e8f0", fontSize: "15px", maxWidth: "600px", margin: "0 auto 20px" }}>
          ទំនិញគុណភាពខ្ពស់ រូបភាពពិតច្បាស់ៗ អាចស្វែងរកតាម Barcode តម្លៃ និងថែមទំនិញថ្មីៗបានគ្រប់ពេល។
        </p>

        <div style={{ display: "inline-flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              padding: "10px 22px",
              background: "#ffffff",
              color: "#065f46",
              borderRadius: "10px",
              fontWeight: "800",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            ➕ បន្ថែមទំនិញថ្មី (Add Any Item)
          </button>

          <button
            type="button"
            onClick={resetProducts}
            style={{
              padding: "10px 18px",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "13px",
              border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
            }}
          >
            🔄 Reset ទំនិញដើម
          </button>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section style={{ padding: "40px 7% 70px", background: "#f8fafc" }}>
        {/* Search, Filter & Sort Controls Bar */}
        <div
          style={{
            background: "#ffffff",
            padding: "20px 24px",
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Top row: Search and Sort */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
              <input
                type="text"
                placeholder="🔍 ស្វែងរកតាមឈ្មោះ, ប្រភេទ ឬលេខ Barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569" }}>
                តម្រៀបតាម:
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                  backgroundColor: "#ffffff",
                }}
              >
                <option value="default">លំនាំដើម (Default)</option>
                <option value="low">តម្លៃ: ទាប ទៅ ខ្ពស់ ($ → $$$)</option>
                <option value="high">តម្លៃ: ខ្ពស់ ទៅ ទាប ($$$ → $)</option>
                <option value="name">ឈ្មោះទំនិញ (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Bottom row: Category filter chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
                    padding: "8px 16px",
                    borderRadius: "30px",
                    border: isSelected ? "none" : "1px solid #cbd5e1",
                    background: isSelected ? "#059669" : "#f8fafc",
                    color: isSelected ? "#ffffff" : "#334155",
                    fontSize: "13px",
                    fontWeight: isSelected ? "800" : "600",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.15s",
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameKh}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      opacity: isSelected ? 0.9 : 0.6,
                      background: isSelected ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                      padding: "1px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1.5px dashed #cbd5e1",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div style={{ fontSize: "50px", marginBottom: "14px" }}>🔍</div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>
              រកមិនឃើញទំនិញក្នុងប្រភេទនេះទេ
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              អ្នកអាចបន្ថែមទំនិញថ្មីចូលក្នុងម៉ាតបានគ្រប់ពេល!
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: "11px 22px",
                background: "#059669",
                color: "#ffffff",
                borderRadius: "10px",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
              }}
            >
              ➕ បន្ថែមទំនិញឥឡូវនេះ
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredProducts.map((product) => {
              const approxRiel = Math.round(product.price * 4100).toLocaleString();

              return (
                <div
                  key={product.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                  className="mart-product-card"
                >
                  {/* Image & Badges */}
                  <div
                    style={{
                      height: "210px",
                      position: "relative",
                      background: "#f1f5f9",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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

                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(4px)",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "8px",
                      }}
                    >
                      ស្តុក: {product.stock || 50}
                    </span>

                    {product.barcode && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          left: "10px",
                          background: "rgba(255, 255, 255, 0.9)",
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

                    {product.isCustom && (
                      <button
                        type="button"
                        onClick={(e) =>
                          handleDeleteProduct(e, product.id, product.nameKh || product.name)
                        }
                        title="លុបទំនិញដែលបានបន្ថែមនេះ"
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          right: "8px",
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
                        🗑️ លុប
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
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
                            fontSize: "12px",
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
                          lineHeight: "1.4",
                          marginBottom: "4px",
                        }}
                      >
                        {product.nameKh || product.name}
                      </h3>

                      {product.nameKh && product.name && (
                        <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
                          {product.name}
                        </div>
                      )}
                    </div>

                    {/* Bottom */}
                    <div style={{ marginTop: "14px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginBottom: "12px",
                          paddingTop: "8px",
                          borderTop: "1px solid #f1f5f9",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                            <span
                              style={{
                                fontSize: "20px",
                                fontWeight: "900",
                                color: "#0f172a",
                              }}
                            >
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
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            ≈ {approxRiel} ៛
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#f59e0b",
                            fontWeight: "700",
                          }}
                        >
                          ★ {product.rating || 4.9}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, product)}
                          style={{
                            padding: "9px 12px",
                            background: "#0f172a",
                            color: "#ffffff",
                            borderRadius: "10px",
                            border: "none",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          <span>🛍️</span>
                          <span>ទិញភ្លាម</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          style={{
                            padding: "9px 12px",
                            background: "#059669",
                            color: "#ffffff",
                            borderRadius: "10px",
                            border: "none",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          <span>+ ដាក់កន្ត្រក</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
              Fresh<span style={{ color: "#34d399" }}>Mart</span> Catalog
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#e2e8f0", fontSize: "14px", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/products" style={{ color: "#e2e8f0", fontSize: "14px", textDecoration: "none" }}>
              Products
            </Link>
            <Link to="/cart" style={{ color: "#e2e8f0", fontSize: "14px", textDecoration: "none" }}>
              Cart ({totalQuantity})
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
          © 2026 FreshMart Supermarket Catalog & POS
        </div>
      </footer>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
}

export default Products;
