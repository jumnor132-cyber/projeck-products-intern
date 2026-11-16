import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { useMartProducts } from "../utils/products";
import ShopHeader from "../components/ShopHeader";
import ShopFooter from "../components/ShopFooter";
import QuickViewModal from "../components/QuickViewModal";

export default function Home() {
  const navigate = useNavigate();
  const { products, deleteProduct, resetProducts, categories } = useMartProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [toast, setToast] = useState(null);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Card quantity steppers: map of { [productId]: quantity }
  const [quantities, setQuantities] = useState({});

  // Hero Carousel Slide (0, 1, 2)
  const [heroSlide, setHeroSlide] = useState(0);

  // Flash Deals Countdown Timer (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState(13680); // ~3h 48m

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate hero banners every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
      hours: String(h).padStart(2, "0"),
      minutes: String(m).padStart(2, "0"),
      seconds: String(s).padStart(2, "0"),
    };
  };

  const countdown = formatCountdown(timeLeft);

  // Handle quantity change on card
  const handleQtyChange = (e, productId, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  // Add to cart with card quantity
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);

    setToast({
      message: `✓ បានបន្ថែម "${product.nameKh || product.name}" (x${qty}) ទៅកន្ត្រក! 🛒`,
    });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Buy Now
  const handleBuyNow = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    navigate("/checkout");
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    const el = document.getElementById("mart-products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteProduct = (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`តើអ្នកពិតជាចង់លុបទំនិញ "${name}" ចេញពីម៉ាតមែនទេ?`)) {
      deleteProduct(id);
      setToast({ message: `🗑️ បានលុបទំនិញ "${name}" រួចរាល់។` });
      setTimeout(() => setToast(null), 2500);
    }
  };

  // Filter & Sort
  let filteredProducts = products.filter((product) => {
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

  if (sortBy === "price_asc") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "price_desc") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) =>
      (a.nameKh || a.name).localeCompare(b.nameKh || b.name)
    );
  } else if (sortBy === "discount") {
    filteredProducts.sort((a, b) => {
      const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discB - discA;
    });
  }

  // Hero Banners data
  const HERO_SLIDES = [
    {
      badge: "🥦 ផ្សារបន្លែ & ផ្លែឈើស្រស់ៗ • Farm Fresh Harvest",
      title: "បន្លែ និងផ្លែឈើស្រស់ៗ",
      titleHighlight: "បញ្ចុះតម្លៃរហូតដល់ 30%",
      desc: "ផ្លែឈើស្រស់ៗនាំចូលលំដាប់ខ្ពស់ គ្មានជាតិគីមី ត្រួតពិនិត្យគុណភាពរាល់ព្រឹក ដឹកជញ្ជូនរហ័ស 30 នាទីដល់មាត់ទ្វារ!",
      ctaText: "🛒 ទិញទំនិញស្រស់ៗឥឡូវនេះ",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      themeColor: "#059669",
    },
    {
      badge: "🥤 ភេសជ្ជៈត្រជាក់ & អាហារសម្រន់ • Cold Drinks & Snacks",
      title: "ភេសជ្ជៈត្រជាក់ និងមីកញ្ចប់",
      titleHighlight: "តម្លៃចាប់ពី $0.50 ប៉ុណ្ណោះ!",
      desc: "កូកាកូឡាត្រជាក់ ទឹកដោះគោ Meiji តែបៃតង Cold Brew ដំឡូងបារាំង Lay's និងមីម៉ាម៉ាឆ្ងាញ់ៗ កុម្ម៉ង់ភ្លាម ដឹកជូនភ្លាម!",
      ctaText: "🥤 មើលភេសជ្ជៈត្រជាក់ៗ",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1200&q=80",
      themeColor: "#0284c7",
    },
    {
      badge: "🚚 សេវាដឹកជញ្ជូនរហ័ស • 30-Min Fast Courier",
      title: "FreshMart Express",
      titleHighlight: "ដឹកជញ្ជូនឥតគិតថ្លៃ ចាប់ពី $15",
      desc: "មិនចាំបាច់ចេញក្រៅផ្ទះ! គ្រាន់តែកុម្ម៉ង់តាមគេហទំព័រ យើងខ្ញុំនឹងដឹកជូនដល់មុខផ្ទះរហ័សទាន់ចិត្ត ជាមួយជម្រើសទូទាត់ KHQR!",
      ctaText: "🧾 បញ្ជាទិញ & Checkout POS",
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
      themeColor: "#7c3aed",
    },
  ];

  const currentSlide = HERO_SLIDES[heroSlide];

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
          <div style={{ fontSize: "14px", fontWeight: "700" }}>{toast.message}</div>
          <Link
            to="/cart"
            style={{
              padding: "6px 14px",
              background: "#059669",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "800",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            មើលកន្ត្រក 🛒 →
          </Link>
        </div>
      )}

      {/* Main Header */}
      <ShopHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onProductAdded={(newProd) => {
          setToast({
            message: `🎉 បានបន្ថែមទំនិញថ្មី "${newProd.nameKh || newProd.name}" ចូលម៉ាតជោគជ័យ!`,
          });
          setTimeout(() => setToast(null), 3500);
        }}
      />

      {/* 1. HERO SECTION WITH PROMO SLIDER & SIDE CARDS */}
      <section
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          color: "#ffffff",
          padding: "36px 24px 44px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.4fr 0.85fr",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          {/* Main Hero Slider Banner */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div>
              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  background: "rgba(255, 255, 255, 0.16)",
                  borderRadius: "30px",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  color: "#a7f3d0",
                  marginBottom: "18px",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                }}
              >
                {currentSlide.badge}
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: "900",
                  lineHeight: "1.2",
                  marginBottom: "16px",
                  letterSpacing: "-0.8px",
                }}
              >
                {currentSlide.title}
                <br />
                <span style={{ color: "#34d399" }}>{currentSlide.titleHighlight}</span>
              </h1>

              {/* Description */}
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.7",
                  color: "#e2e8f0",
                  marginBottom: "26px",
                  maxWidth: "540px",
                }}
              >
                {currentSlide.desc}
              </p>

              {/* Hero Action Buttons */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <a
                  href="#mart-products-grid"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 26px",
                    background: "#ffffff",
                    color: "#065f46",
                    borderRadius: "12px",
                    fontWeight: "900",
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <span>{currentSlide.ctaText}</span>
                  <span>↓</span>
                </a>

                <Link
                  to="/checkout"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 22px",
                    background: "rgba(16, 185, 129, 0.3)",
                    color: "#a7f3d0",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "14px",
                    border: "1px solid rgba(167, 243, 208, 0.4)",
                    textDecoration: "none",
                  }}
                >
                  <span>🧾 Checkout POS (API) →</span>
                </Link>
              </div>
            </div>

            {/* Slider Dots */}
            <div style={{ display: "flex", gap: "8px", marginTop: "32px", alignItems: "center" }}>
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setHeroSlide(idx)}
                  style={{
                    width: heroSlide === idx ? "28px" : "10px",
                    height: "10px",
                    borderRadius: "10px",
                    background: heroSlide === idx ? "#34d399" : "rgba(255, 255, 255, 0.35)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side Promo Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Promo Card 1: Weekend Coupon */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e293b, #0f172a)",
                borderRadius: "20px",
                padding: "22px 24px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    background: "#f59e0b",
                    color: "#0f172a",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  🔥 VOUCHER បញ្ចុះតម្លៃ 20%
                </span>
                <h3 style={{ fontSize: "18px", fontWeight: "900", margin: "10px 0 4px" }}>
                  លេខកូដ: <span style={{ color: "#38bdf8", letterSpacing: "1px" }}>STYLE20</span>
                </h3>
                <p style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: "1.5" }}>
                  ប្រើប្រាស់នៅទំព័រ Checkout ដើម្បីបញ្ចុះតម្លៃ 20% ភ្លាមៗលើរាល់ការកុម្ម៉ង់!
                </p>
              </div>

              <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#64748b" }}>សុពលភាព: គ្មានកំណត់</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("STYLE20");
                    alert("✓ បានចម្លងលេខកូដ 'STYLE20' រួចរាល់!");
                  }}
                  style={{
                    padding: "6px 14px",
                    background: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  📋 ចម្លងកូដ
                </button>
              </div>
            </div>

            {/* Promo Card 2: 30-Min Fast Courier & KHQR */}
            <div
              style={{
                background: "linear-gradient(135deg, #064e3b, #047857)",
                borderRadius: "20px",
                padding: "22px 24px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  flexShrink: 0,
                }}
              >
                ⚡
              </div>
              <div>
                <strong style={{ fontSize: "16px", fontWeight: "900", display: "block" }}>
                  ដឹកជញ្ជូនរហ័ស 30 នាទី
                </strong>
                <p style={{ fontSize: "12.5px", color: "#d1fae5", margin: "4px 0 0", lineHeight: "1.5" }}>
                  ទូទាត់តាម <strong>Bakong KHQR</strong> ឬសាច់ប្រាក់ពេលទទួលទំនិញ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLASH DEALS WITH REAL COUNTDOWN TIMER */}
      <section
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#fef2f2",
                color: "#dc2626",
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid #fecaca",
                fontWeight: "900",
                fontSize: "13px",
              }}
            >
              <span>⚡</span> FLASH SALE ប្រចាំថ្ងៃ
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#64748b" }}>
                បញ្ចប់ក្នុងរយៈពេល:
              </span>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span
                  style={{
                    background: "#0f172a",
                    color: "#ffffff",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontWeight: "900",
                    fontSize: "13px",
                    fontFamily: "monospace",
                  }}
                >
                  {countdown.hours}
                </span>
                <span style={{ fontWeight: "900", color: "#0f172a" }}>:</span>
                <span
                  style={{
                    background: "#0f172a",
                    color: "#ffffff",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontWeight: "900",
                    fontSize: "13px",
                    fontFamily: "monospace",
                  }}
                >
                  {countdown.minutes}
                </span>
                <span style={{ fontWeight: "900", color: "#0f172a" }}>:</span>
                <span
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontWeight: "900",
                    fontSize: "13px",
                    fontFamily: "monospace",
                  }}
                >
                  {countdown.seconds}
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "13px", color: "#059669", fontWeight: "700" }}>
            🔥 លក់ដាច់បាន 82% • ទំនិញក្នុងស្តុកនៅសល់តិច!
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES AISLE BAR */}
      <section style={{ padding: "36px 24px 20px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "20px",
            }}
          >
            <div>
              <span
                style={{
                  color: "#059669",
                  fontWeight: "800",
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                SUPERMARKET AISLES
              </span>
              <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0" }}>
                ជ្រើសរើសតាមផ្នែកក្នុងម៉ាត (Shop by Category)
              </h2>
            </div>

            <Link
              to="/products"
              style={{
                color: "#059669",
                fontSize: "13px",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              មើលកាតាឡុកទាំងអស់ ({products.length}) →
            </Link>
          </div>

          {/* Category Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "12px",
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
                    padding: "16px 12px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.25s ease",
                    boxShadow: isSelected
                      ? "0 8px 20px rgba(5, 150, 105, 0.25)"
                      : "0 2px 6px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "28px", display: "block" }}>{cat.icon}</span>
                  <span style={{ fontSize: "13.5px", fontWeight: "800" }}>{cat.nameKh}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: isSelected ? "#d1fae5" : "#64748b",
                      fontWeight: "600",
                    }}
                  >
                    {count} មុខទំនិញ
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS CATALOG SHOWCASE */}
      <section
        id="mart-products-grid"
        style={{ padding: "30px 24px 70px", background: "#f8fafc" }}
      >
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          {/* Header & Filter Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div>
              <span
                style={{
                  color: "#059669",
                  fontWeight: "800",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                AUTHENTIC GROCERY CATALOG
              </span>
              <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0" }}>
                {selectedCategory === "all"
                  ? "មុខទំនិញក្នុងម៉ាតទាំងអស់ (All Products)"
                  : categories.find((c) => c.id === selectedCategory)?.nameKh}
              </h2>
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "3px" }}>
                បង្ហាញ <strong>{filteredProducts.length}</strong> ទំនិញក្នុងស្តុក (រូបភាពពិត & គុណភាពខ្ពស់)
                {searchQuery ? ` • លទ្ធផលស្វែងរក: "${searchQuery}"` : ""}
              </p>
            </div>

            {/* Sort & Actions */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>តម្រៀប:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    background: "#ffffff",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    color: "#334155",
                    outline: "none",
                  }}
                >
                  <option value="popular">ពេញនិយមបំផុត</option>
                  <option value="price_asc">តម្លៃ: ទាប ទៅ ខ្ពស់</option>
                  <option value="price_desc">តម្លៃ: ខ្ពស់ ទៅ ទាប</option>
                  <option value="discount">បញ្ចុះតម្លៃច្រើនជាងគេ</option>
                  <option value="name">ឈ្មោះទំនិញ (A-Z)</option>
                </select>
              </div>

              {selectedCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
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
                onClick={resetProducts}
                title="កំណត់ទំនិញលំនាំដើមឡើងវិញ"
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

          {/* Empty State */}
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
                រកមិនឃើញទំនិញ "{searchQuery}" ទេ
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
                អ្នកអាចចុចបន្ថែមទំនិញនេះចូលក្នុងម៉ាតបានយ៉ាងងាយស្រួល!
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
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
                សម្អាតការស្វែងរក
              </button>
            </div>
          ) : (
            /* Products Grid */
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

                      {/* Discount Tag */}
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

                      {/* Barcode & Stock Overlay */}
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
                              border: "1px solid rgba(0,0,0,0.08)",
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

                      {/* Delete button if custom */}
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

                        {/* Title */}
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

                          {/* Star Rating */}
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
                                justifyItems: "center",
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
                                justifyItems: "center",
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

      {/* 5. CUSTOMER TESTIMONIALS / SOCIAL PROOF */}
      <section
        style={{
          background: "#ffffff",
          padding: "50px 24px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 36px" }}>
            <span
              style={{
                color: "#059669",
                fontWeight: "800",
                fontSize: "11px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              CUSTOMER EXPERIENCES
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", margin: "4px 0 8px" }}>
              អតិថិជនពេញចិត្តការទិញទំនិញក្នុងម៉ាតរបស់យើង
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              ការវាយតម្លៃពិតពីអតិថិជនជាង 1,400+ នាក់នៅទូទាំងរាជធានីភ្នំពេញ
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "22px",
            }}
          >
            {/* Review 1 */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ color: "#f59e0b", fontSize: "16px", marginBottom: "10px" }}>
                ★★★★★
              </div>
              <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.7", marginBottom: "16px" }}>
                "សេវាដឹកជញ្ជូនរហ័សខ្លាំងណាស់ កុម្ម៉ង់តែ 20 នាទីប៉ុណ្ណោះ ផ្លែឈើ និងភេសជ្ជៈមកដល់ត្រជាក់ស្រស់ៗតែម្តង! ការទូទាត់ KHQR ស្រួលប្រើមែនទែន។"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#059669",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "14px",
                  }}
                >
                  ST
                </div>
                <div>
                  <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>
                    Sokun Theara
                  </strong>
                  <small style={{ color: "#059669", fontSize: "11px", fontWeight: "700" }}>
                    ✓ អ្នកទិញផ្ទៀងផ្ទាត់ (ទួលគោក)
                  </small>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ color: "#f59e0b", fontSize: "16px", marginBottom: "10px" }}>
                ★★★★★
              </div>
              <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.7", marginBottom: "16px" }}>
                "ទំនិញមានគុណភាពល្អ និងតម្លៃសមរម្យជាងម៉ាតផ្សេងទៀត។ មានជម្រើសច្រើនដូចជាមីម៉ាម៉ា ទឹកដោះគោ Meiji និងសាប៊ូដុសខ្លួន ពេញចិត្ត 100%!"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#0284c7",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "14px",
                  }}
                >
                  KP
                </div>
                <div>
                  <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>
                    Kalyan Pich
                  </strong>
                  <small style={{ color: "#059669", fontSize: "11px", fontWeight: "700" }}>
                    ✓ អ្នកទិញផ្ទៀងផ្ទាត់ (BKK1)
                  </small>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ color: "#f59e0b", fontSize: "16px", marginBottom: "10px" }}>
                ★★★★★
              </div>
              <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.7", marginBottom: "16px" }}>
                "ការវេចខ្ចប់មានអនាម័យខ្ពស់ បុគ្គលិកអ្នកដឹកសុភាពរាបសារ។ អាចតាមដានការដឹកជញ្ជូនលើ web ផ្ទាល់ដឹងថាអ្នកដឹកដល់ណាហើយ ងាយស្រួលណាស់!"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#7c3aed",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "14px",
                  }}
                >
                  VM
                </div>
                <div>
                  <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>
                    Vireak Meng
                  </strong>
                  <small style={{ color: "#059669", fontSize: "11px", fontWeight: "700" }}>
                    ✓ អ្នកទិញផ្ទៀងផ្ទាត់ (សែនសុខ)
                  </small>
                </div>
              </div>
            </div>
          </div>
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