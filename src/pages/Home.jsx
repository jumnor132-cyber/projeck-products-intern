import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, addToCart } from "../utils/cart";
import { useMartProducts } from "../utils/products";
import AddProductModal from "../components/AddProductModal";
import "../index.css";

function Home() {
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const { products, deleteProduct, resetProducts, categories } = useMartProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (product.name && product.name.toLowerCase().includes(query)) ||
      (product.nameKh && product.nameKh.toLowerCase().includes(query)) ||
      (product.barcode && product.barcode.includes(query)) ||
      (product.unit && product.unit.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setToast({
      message: `✓ បានបន្ថែម "${product.nameKh || product.name}" ទៅក្នុងកន្ត្រក! 🛒`,
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

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    const el = document.getElementById("mart-products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProductAdded = (newProd) => {
    setToast({
      message: `🎉 បានបន្ថែមទំនិញថ្មី "${newProd.nameKh || newProd.name}" ចូលក្នុងម៉ាតជោគជ័យ!`,
    });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleDeleteProduct = (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`តើអ្នកពិតជាចង់លុបទំនិញ "${name}" ចេញពីម៉ាតមែនទេ?`)) {
      deleteProduct(id);
      setToast({
        message: `🗑️ បានលុបទំនិញ "${name}" រួចរាល់។`,
      });
      setTimeout(() => {
        setToast(null);
      }, 2500);
    }
  };

  return (
    <div className="home-page">
      {/* Toast Notification */}
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
              whiteSpace: "nowrap",
            }}
          >
            មើលកន្ត្រក 🛒 →
          </Link>
        </div>
      )}

      {/* Top Banner Notice for Mart Delivery */}
      <div
        style={{
          background: "linear-gradient(90deg, #047857, #059669)",
          color: "#ffffff",
          textAlign: "center",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: "600",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          letterSpacing: "0.2px",
        }}
      >
        <span>⚡ FreshMart Express ផ្សារទំនើប & ម៉ាតទំនិញស្រស់ៗ</span>
        <span style={{ opacity: 0.7 }}>•</span>
        <span>🚚 ដឹកជញ្ជូនរហ័ស 30 នាទីក្នុងក្រុង</span>
        <span style={{ opacity: 0.7 }}>•</span>
        <span>💵 ទូទាត់តាម KHQR & សាច់ប្រាក់ផ្ទាល់</span>
      </div>

      {/* Main Navbar */}
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

        {/* Global Search Bar */}
        <div
          style={{
            flex: "1",
            maxWidth: "480px",
            position: "relative",
            margin: "0 20px",
          }}
        >
          <input
            type="text"
            placeholder="🔍 ស្វែងរកទំនិញក្នុងម៉ាត (ឈ្មោះ, ផ្លែឈើ, មី, ទឹកក្រូច ឬ Barcode)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 40px 11px 16px",
              borderRadius: "12px",
              border: "1.5px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              backgroundColor: "#f8fafc",
              transition: "all 0.2s",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
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

        {/* Nav Links & Actions */}
        <nav className="shop-nav-links" style={{ gap: "20px" }}>
          <Link to="/" className="active" style={{ color: "#059669", fontWeight: "700" }}>
            ទំព័រដើម (Home)
          </Link>
          <Link to="/products" style={{ fontWeight: "600" }}>
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
                  boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
                }}
              >
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
              padding: "6px 12px",
              background: "#f5f3ff",
              borderRadius: "10px",
              border: "1px solid #ddd6fe",
              fontSize: "13px",
            }}
            title="ចូលផ្ទាំងគ្រប់គ្រង (Admin Dashboard)"
          >
            🔐 Admin
          </Link>
        </nav>

        {/* Action Button: Add Item */}
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
            whiteSpace: "nowrap",
          }}
        >
          <span>➕</span>
          <span>ថែមអីវាន់ / បន្ថែមទំនិញ</span>
        </button>
      </header>

      {/* Hero Banner Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          color: "#ffffff",
          padding: "50px 7% 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "40px",
            alignItems: "center",
            maxWidth: "1300px",
            margin: "0 auto",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(8px)",
                borderRadius: "30px",
                fontSize: "13px",
                fontWeight: "700",
                color: "#a7f3d0",
                marginBottom: "18px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span>🛒</span> ម៉ាតទំនិញស្រស់ៗ & សេវាកម្ម POS ទំនើប
            </div>

            <h1
              style={{
                fontSize: "44px",
                fontWeight: "900",
                lineHeight: "1.25",
                marginBottom: "18px",
                letterSpacing: "-1px",
              }}
            >
              ទំនិញក្នុងម៉ាតស្រស់ៗ
              <br />
              <span style={{ color: "#34d399" }}>គុណភាពខ្ពស់ តម្លៃសមរម្យ</span>
            </h1>

            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
                color: "#e2e8f0",
                marginBottom: "28px",
                maxWidth: "520px",
              }}
            >
              ផ្គត់ផ្គង់ភេសជ្ជៈត្រជាក់ៗ មីកញ្ចប់ នំចំណី ផ្លែឈើស្រស់ៗ ទឹកដោះគោ និងគ្រឿងប្រើប្រាស់ប្រចាំថ្ងៃ។ អាចកុម្ម៉ង់ទិញភ្លាមៗ និងថែមមុខទំនិញថ្មីៗបានតាមចិត្ត!
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
              <a
                href="#mart-products-grid"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "#ffffff",
                  color: "#065f46",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                }}
              >
                <span>🛒 ទិញទំនិញឥឡូវនេះ</span>
                <span>↓</span>
              </a>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 24px",
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "14px",
                  border: "1.5px solid rgba(255, 255, 255, 0.3)",
                  cursor: "pointer",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span>➕ បន្ថែមមុខទំនិញថ្មី</span>
              </button>

              <Link
                to="/checkout"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "14px 20px",
                  background: "rgba(16, 185, 129, 0.25)",
                  color: "#a7f3d0",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "13px",
                  border: "1px solid rgba(167, 243, 208, 0.4)",
                  textDecoration: "none",
                }}
              >
                <span>🧾 Checkout POS (API) →</span>
              </Link>
            </div>

            {/* Quick Mart Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "38px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <div>
                <strong style={{ fontSize: "24px", fontWeight: "900", display: "block" }}>
                  {products.length}+
                </strong>
                <small style={{ color: "#cbd5e1", fontSize: "12px" }}>មុខទំនិញក្នុងម៉ាត</small>
              </div>
              <div>
                <strong style={{ fontSize: "24px", fontWeight: "900", display: "block" }}>
                  100%
                </strong>
                <small style={{ color: "#cbd5e1", fontSize: "12px" }}>រូបភាព & ទំនិញពិត</small>
              </div>
              <div>
                <strong style={{ fontSize: "24px", fontWeight: "900", display: "block" }}>
                  24/7
                </strong>
                <small style={{ color: "#cbd5e1", fontSize: "12px" }}>កុម្ម៉ង់ & POS ផ្ទាល់</small>
              </div>
            </div>
          </div>

          {/* Hero Visual Display */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
                border: "4px solid rgba(255, 255, 255, 0.15)",
                maxHeight: "440px",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80"
                alt="Supermarket grocery store"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Floating Mart Badge 1 */}
            <div
              style={{
                position: "absolute",
                bottom: "-15px",
                left: "-20px",
                background: "#ffffff",
                color: "#0f172a",
                padding: "14px 20px",
                borderRadius: "16px",
                boxShadow: "0 20px 35px rgba(0, 0, 0, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#ecfdf5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                🥤
              </div>
              <div>
                <strong style={{ fontSize: "14px", display: "block", color: "#0f172a" }}>
                  កូកាកូឡា & ភេសជ្ជៈ
                </strong>
                <small style={{ color: "#64748b", fontSize: "12px" }}>
                  ត្រជាក់ស្រស់ ត្រឹមតែ $0.75
                </small>
              </div>
            </div>

            {/* Floating Mart Badge 2 */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "-15px",
                background: "#ffffff",
                color: "#0f172a",
                padding: "10px 18px",
                borderRadius: "14px",
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <span style={{ fontSize: "18px" }}>🍎</span>
              <div>
                <strong style={{ fontSize: "13px", color: "#059669" }}>ផ្លែឈើស្រស់ 100%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supermarket Categories Bar */}
      <section style={{ padding: "40px 7% 10px", background: "#f8fafc" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "24px",
          }}
        >
          <div>
            <span
              style={{
                color: "#059669",
                fontWeight: "800",
                fontSize: "12px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              SUPERMARKET CATEGORIES
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "4px 0 0" }}>
              ជ្រើសរើសតាមប្រភេទក្នុងម៉ាត (Shop by Category)
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              background: "#ecfdf5",
              color: "#059669",
              border: "1px solid #a7f3d0",
              padding: "8px 16px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>➕ បន្ថែមមុខទំនិញថ្មី</span>
          </button>
        </div>

        {/* Category Cards Carousel / Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "14px",
          }}
        >
          {categories.map((cat) => {
            const count =
              cat.id === "all"
                ? products.length
                : products.filter((p) => p.category === cat.id).length;

            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  background: isSelected ? "linear-gradient(135deg, #059669, #047857)" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#1e293b",
                  border: isSelected ? "none" : "1.5px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px 14px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected
                    ? "0 10px 20px rgba(5, 150, 105, 0.25)"
                    : "0 2px 5px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "32px", display: "block" }}>{cat.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: "700" }}>{cat.nameKh}</span>
                <span
                  style={{
                    fontSize: "11px",
                    color: isSelected ? "#d1fae5" : "#64748b",
                    fontWeight: "500",
                  }}
                >
                  {count} មុខទំនិញ
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Products Showcase Section */}
      <section
        id="mart-products-grid"
        style={{ padding: "40px 7% 70px", background: "#f8fafc" }}
      >
        {/* Filter & Search Info Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "28px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div>
            <span
              style={{
                color: "#059669",
                fontWeight: "800",
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              MART CATALOG
            </span>
            <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0" }}>
              {selectedCategory === "all"
                ? "មុខទំនិញទាំងអស់ក្នុងម៉ាត (All Mart Products)"
                : categories.find((c) => c.id === selectedCategory)?.nameKh}
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
              បង្ហាញ {filteredProducts.length} ទំនិញក្នុងស្តុក (រូបភាពពិត & គុណភាពខ្ពស់)
              {searchQuery ? ` ស្វែងរក: "${searchQuery}"` : ""}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                ✕ មើលទាំងអស់
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: "9px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#059669",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
              }}
            >
              <span>➕ ថែមអីវាន់ថ្មី</span>
            </button>

            <button
              type="button"
              onClick={resetProducts}
              title="កំណត់ទំនិញលំនាំដើមឡើងវិញ"
              style={{
                padding: "9px 12px",
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

        {/* Empty State */}
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
              រកមិនឃើញទំនិញដែលអ្នកស្វែងរកទេ
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              អ្នកអាចបន្ថែមទំនិញនេះចូលក្នុងម៉ាតបានយ៉ាងងាយស្រួល!
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
              ➕ បន្ថែមទំនិញនេះឥឡូវនេះ
            </button>
          </div>
        ) : (
          /* Products Grid */
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
                    transition: "all 0.25s ease",
                    position: "relative",
                  }}
                  className="mart-product-card"
                >
                  {/* Product Image & Badges */}
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
                        transition: "transform 0.4s ease",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80";
                      }}
                    />

                    {/* Promo Badge */}
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

                    {/* Stock Status Badge */}
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

                    {/* Barcode Tag at Bottom of Image */}
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
                          border: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        BAR: {product.barcode}
                      </span>
                    )}

                    {/* Custom Product Delete Button */}
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

                  {/* Product Details */}
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
                      {/* Category & Unit */}
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

                      {/* Product Name (Khmer & English) */}
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
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            marginBottom: "10px",
                          }}
                        >
                          {product.name}
                        </div>
                      )}
                    </div>

                    {/* Bottom Pricing & Actions */}
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

                      {/* Action Buttons: Buy Now & Add to Cart */}
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
                          title="ទិញភ្លាមៗ & ទៅកាន់ Checkout"
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
                          title="ដាក់ចូលកន្ត្រក (Add to Cart)"
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

      {/* Supermarket Features Grid */}
      <section style={{ padding: "50px 7%", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#ecfdf5",
                color: "#059669",
                fontSize: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              🥗
            </div>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                ទំនិញស្រស់ៗ 100%
              </h4>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
                ធានាគុណភាពល្អបំផុត ត្រួតពិនិត្យ និងជ្រើសរើសយ៉ាងយកចិត្តទុកដាក់។
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#f0fdf4",
                color: "#16a34a",
                fontSize: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              🚚
            </div>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                ដឹកជញ្ជូនរហ័សទាន់ចិត្ត
              </h4>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
                ដឹកដល់មុខផ្ទះរហ័សទាន់ចិត្ត មិនចាំបាច់រង់ចាំយូរ។
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#eff6ff",
                color: "#2563eb",
                fontSize: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              💳
            </div>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                ទូទាត់ងាយស្រួល KHQR & Cash
              </h4>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
                ស្កេនបង់លុយតាម Bakong KHQR គ្រប់ធនាគារ ឬបង់ពេលទំនិញដល់ដៃ។
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#faf5ff",
                color: "#9333ea",
                fontSize: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              🔌
            </div>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                MySQL & PHP API Synced
              </h4>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
                ភ្ជាប់ទិន្នន័យផ្ទាល់ជាមួយ PHP Backend & MySQL Database សុវត្ថិភាព 100%។
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "50px 7% 30px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            paddingBottom: "30px",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "32px" }}>🏪</span>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: "#ffffff" }}>
                Fresh<span style={{ color: "#34d399" }}>Mart</span>
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                ប្រព័ន្ធលក់ទំនិញក្នុងម៉ាត & Supermarket POS
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#e2e8f0", fontSize: "14px", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/products" style={{ color: "#e2e8f0", fontSize: "14px", textDecoration: "none" }}>
              Products
            </Link>
            <Link to="/cart" style={{ color: "#e2e8f0", fontSize: "14px", textDecoration: "none" }}>
              Cart ({totalQuantity})
            </Link>
            <Link
              to="/checkout"
              style={{ color: "#34d399", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}
            >
              Checkout POS
            </Link>
            <Link
              to="/admin"
              style={{ color: "#c084fc", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}
            >
              🔐 Admin Dashboard
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            fontSize: "12px",
            color: "#64748b",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>© 2026 FreshMart Supermarket & POS System. All rights reserved.</div>
          <div>API Connection: http://localhost/productcode/ApI.php</div>
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

export default Home;