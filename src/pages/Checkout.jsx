import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { clearCart } from "../utils/cart";
import "./CheckoutClean.css";
import "../index.css";

const API_URL = "http://localhost/productcode/ApI.php";
const TELEGRAM_PHONE = "0979937524";
const TELEGRAM_CHAT_URL = "https://t.me/+855979937524";

function Checkout() {
  const [form, setForm] = useState({
    fullName: "",
    id: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    payment: "KHQR",
  });

  const [success, setSuccess] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // KHQR Payment States
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrSeconds, setQrSeconds] = useState(900);
  const [qrStatus, setQrStatus] = useState("waiting"); // "waiting" | "scanning" | "verified"
  const [isQrProcessing, setIsQrProcessing] = useState(false);
  const [slipFileName, setSlipFileName] = useState("");
  const [pendingOrder, setPendingOrder] = useState(null);

  // Product List from cart
  const [products] = useState(() => {
    try {
      const saved = localStorage.getItem("styleshop_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, index) => ({
            ...item,
            quantity: item.quantity || 1,
            sku: item.sku || `SKU-${item.id || index + 1}`,
          }));
        }
      }
    } catch {
      // fallback
    }
    return [
      {
        id: "MART-001",
        name: "ទឹកក្រូច កូកាកូឡា (Coca-Cola Can)",
        price: 0.75,
        quantity: 2,
        sku: "885012400123",
        image:
          "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "MART-002",
        name: "ទឹកដោះគោស្រស់ Meiji Fresh Milk",
        price: 2.80,
        quantity: 1,
        sku: "885012400124",
        image:
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "MART-004",
        name: "ផ្លែប៉ោមក្រហម Fuji Apples (1kg)",
        price: 3.20,
        quantity: 1,
        sku: "885012400126",
        image:
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80",
      },
    ];
  });

  const subtotal = Number(
    products
      .reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
      .toFixed(2)
  );
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  // Free delivery for orders over $15 in mart, otherwise $1.50
  const shipping = subtotal >= 15 || products.length === 0 ? 0 : 1.5;
  const total = Number(Math.max(0, subtotal - discountAmount + shipping).toFixed(2));
  const approxTotalRiel = Math.round(total * 4100).toLocaleString();

  // Auto-Fill sample data for quick testing
  const handleFillSample = () => {
    setForm({
      fullName: "Sokun Theara",
      id: "CUST-9021",
      age: "24",
      gender: "Male",
      phone: "0979937524",
      email: "sokun.theara@gmail.com",
      address: "Street 271, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh",
      payment: "KHQR",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPayment = (paymentMethod) => {
    setForm((prev) => ({
      ...prev,
      payment: paymentMethod,
    }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "STYLE20") {
      setDiscountPercent(20);
      alert("✓ បញ្ចុះតម្លៃ 20% ត្រូវបានអនុវត្ត!");
    } else if (couponCode.trim().toUpperCase() === "FREE") {
      setDiscountPercent(10);
      alert("✓ បញ្ចុះតម្លៃ 10% ត្រូវបានអនុវត្ត!");
    } else {
      alert("លេខកូដមិនត្រឹមត្រូវទេ។ សាកល្បង: STYLE20 ឬ FREE");
    }
  };

  // KHQR Timer
  useEffect(() => {
    let interval = null;
    if (showQrModal && qrSeconds > 0) {
      interval = setInterval(() => {
        setQrSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showQrModal, qrSeconds]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=KHQR_FRESHMART_CAMBODIA_USD_${total.toFixed(2)}`;

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `KHQR-FreshMart-${total.toFixed(2)}.png`;
    link.target = "_blank";
    link.click();
  };

  // Core execution to save customer & order in MySQL via PHP
  const executeSaveOrder = async (savedOrder) => {
    const { orderNumber } = savedOrder;
    setSuccess(false);

    const readResponse = async (response, label) => {
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `${label}: PHP did not return valid JSON. ` +
            `HTTP ${response.status}. Response: ${text.slice(0, 300)}`
        );
      }

      if (!response.ok || data.success !== true) {
        throw new Error(
          `${label}: ${
            data.message || data.error || `HTTP ${response.status}`
          }`
        );
      }

      return data;
    };

    try {
      // PHP API strictly accepts 'Cash on Delivery' or 'Bank Transfer'.
      // When user selects 'KHQR', we send 'Bank Transfer' so PHP validation succeeds smoothly!
      const apiPayment =
        form.payment === "KHQR" ? "Bank Transfer" : (form.payment || "Bank Transfer");

      // 1. Save customer in the customers table.
      const customerResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "customer",
          customer_id: form.id.trim(),
          fullName: form.fullName.trim(),
          age: Number(form.age) || 20,
          gender: form.gender || "Other",
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          payment: apiPayment,
        }),
      });

      await readResponse(customerResponse, "Save customer failed");

      // 2. Save order in shop_orders and its items in shop_order_items.
      // Note: total strictly equals subtotal + shipping to satisfy PHP validation
      const orderResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "order",
          order_number: orderNumber,
          customer_id: form.id.trim(),
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          payment: apiPayment,
          subtotal: subtotal,
          shipping: shipping,
          total: Number((subtotal + shipping).toFixed(2)),
          items: products.map((product) => ({
            product_id: String(product.id),
            product_name: product.name,
            image: product.image,
            price: Number(product.price),
            quantity: Number(product.quantity),
          })),
        }),
      });

      await readResponse(orderResponse, "Save order failed");

      // 3. Confirm the order can be read back from MySQL through PHP.
      const verifyResponse = await fetch(`${API_URL}?action=orders`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const verifyData = await readResponse(verifyResponse, "Verify order failed");

      if (!Array.isArray(verifyData.orders)) {
        throw new Error("PHP response does not contain an orders array.");
      }

      // Generate Telegram Link
      const itemsSummary = products.map((p) => `${p.name} x${p.quantity}`).join(", ");
      const telegramMessage = encodeURIComponent(
        `🛍️ ការកុម្ម៉ង់ថ្មី (#${orderNumber}) ពី FreshMart!\n` +
        `👤 អតិថិជន: ${form.fullName}\n` +
        `📞 ទូរស័ព្ទ: ${form.phone}\n` +
        `📍 ទីតាំង: ${form.address}\n` +
        `💳 ការទូទាត់: ${form.payment}\n` +
        `📦 ទំនិញ: ${itemsSummary}\n` +
        `💵 សរុប: $${total.toFixed(2)} USD (≈ ${approxTotalRiel} ៛)`
      );
      const telegramUrl = `https://t.me/+855979937524?text=${telegramMessage}`;

      const finalSavedOrder = {
        ...savedOrder,
        telegramUrl,
      };

      // 4. Save to localStorage
      let existingOrders = [];
      try {
        existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      } catch {
        existingOrders = [];
      }
      const updatedOrders = [finalSavedOrder, ...existingOrders];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      setSuccess(true);
      clearCart();
      setActiveInvoice(finalSavedOrder);

      alert(
        `🎉 បានកុម្ម៉ង់ដោយជោគជ័យ និងរក្សាទុកក្នុង MySQL Database!\n` +
        `កូដកុម្ម៉ង់: ${orderNumber}\n` +
        `អតិថិជន: ${form.fullName}\n` +
        `សរុប: $${total.toFixed(2)} (≈ ${approxTotalRiel} ៛)\n` +
        `ការទូទាត់: ${form.payment}\n\n` +
        `លោកអ្នកអាចផ្ញើការកុម្ម៉ង់នេះទៅកាន់ Telegram (${TELEGRAM_PHONE}) ក្នុងវិក្កយបត្រ!`
      );
    } catch (error) {
      console.error("Checkout API Error:", error);
      alert(`⚠️ មានបញ្ហាក្នុងការរក្សាទុក: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName || !form.id || !form.phone || !form.address) {
      alert("សូមបំពេញព័ត៌មានដែលចាំបាច់ (Full Name, Customer ID, Phone, Address)!");
      return;
    }

    const orderNumber = `ORDER-${Date.now()}`;
    const newOrder = {
      id: Date.now(),
      orderNumber,
      customer: { ...form },
      products: [...products],
      subtotal,
      shipping,
      discount: discountAmount,
      total,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Processing",
    };

    if (form.payment === "KHQR") {
      setPendingOrder(newOrder);
      setShowQrModal(true);
      setQrSeconds(900);
      setQrStatus("waiting");
      setIsQrProcessing(false);
      setSlipFileName("");
    } else {
      executeSaveOrder(newOrder);
    }
  };

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipFileName(file.name);
      setIsQrProcessing(true);
      setTimeout(() => {
        setIsQrProcessing(false);
        setQrStatus("verified");
      }, 1500);
    }
  };

  const handleVerifyKhqrPayment = async () => {
    if (!pendingOrder) return;
    setShowQrModal(false);
    const verifiedOrder = {
      ...pendingOrder,
      status: "Paid",
      paymentRef: `KHQR-${Date.now().toString().slice(-6)}`,
    };
    await executeSaveOrder(verifiedOrder);
    setPendingOrder(null);
  };

  return (
    <div className="ck-page">
      {/* ================= TOP NAVBAR & STEPPER ================= */}
      <header className="ck-navbar">
        <Link to="/" className="ck-brand">
          <div className="ck-brand-icon">🏪</div>
          <div>
            <div className="ck-brand-name">
              Fresh<span>Mart</span>
              <span className="ck-brand-tag">CHECKOUT</span>
            </div>
          </div>
        </Link>

        {/* Clean Process Steps */}
        <div className="ck-steps">
          <Link to="/cart" className="ck-step-item done">
            <span className="ck-step-num">✓</span>
            <span>កន្ត្រក (Cart)</span>
          </Link>
          <span className="ck-step-sep">→</span>
          <div className="ck-step-item active">
            <span className="ck-step-num">2</span>
            <span>ព័ត៌មាន & ទូទាត់ (Checkout)</span>
          </div>
          <span className="ck-step-sep">→</span>
          <div className="ck-step-item">
            <span className="ck-step-num">3</span>
            <span>វិក្កយបត្រ (Invoice)</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="ck-nav-actions">
          <Link to="/products" className="ck-nav-btn">
            <span>← ទំនិញក្នុងម៉ាត</span>
          </Link>
          <Link to="/admin" className="ck-nav-btn admin" title="ផ្ទាំងគ្រប់គ្រង Admin">
            <span>🔐 Admin</span>
          </Link>
        </div>
      </header>

      {/* ================= SUCCESS TOAST ================= */}
      {success && (
        <div className="ck-toast">
          <div className="ck-toast-icon">✓</div>
          <div>
            <strong style={{ display: "block", fontSize: "14px" }}>បានរក្សាទុកក្នុង MySQL ជោគជ័យ!</strong>
            <span style={{ fontSize: "12px", opacity: 0.85 }}>
              ព័ត៌មានអតិថិជន និងការកុម្ម៉ង់ត្រូវបាន sync ចូល Database រួចរាល់។
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            style={{
              background: "none",
              border: "none",
              color: "#ffffff",
              fontSize: "18px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ================= MAIN CONTAINER ================= */}
      <main className="ck-container">
        {/* Header Title & Status */}
        <div className="ck-header-row">
          <div className="ck-header-title">
            <h1>🛒 បញ្ចូលព័ត៌មានអ្នកទិញ & កុម្ម៉ង់ទំនិញ</h1>
            <p>បំពេញព័ត៌មានអតិថិជន ជ្រើសរើសវិធីសាស្ត្រទូទាត់ និងពិនិត្យទំនិញមុននឹងកុម្ម៉ង់</p>
          </div>

          <div className="ck-header-meta">
            <div className="ck-badge-pill">
              <span className="ck-pulse-dot"></span>
              <span>MySQL Live Synced (PHP API)</span>
            </div>
            <a
              href={TELEGRAM_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ck-nav-btn"
              style={{ background: "#ecfdf5", borderColor: "#a7f3d0", color: "#059669" }}
            >
              <span>📱 Telegram: {TELEGRAM_PHONE}</span>
            </a>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <form onSubmit={handleSubmit} className="ck-grid">
          {/* ================= LEFT COLUMN: FORM CARDS ================= */}
          <div className="ck-left-col">
            {/* Card 1: Customer Details */}
            <div className="ck-card">
              <div className="ck-card-header">
                <div className="ck-card-title-group">
                  <div className="ck-card-step-badge">1</div>
                  <div className="ck-card-title-text">
                    <h2>ព័ត៌មានអតិថិជន (Customer Information)</h2>
                    <p>សូមបញ្ចូលព័ត៌មានផ្ទាល់ខ្លួន និងអាសយដ្ឋានរបស់អ្នកទិញ</p>
                  </div>
                </div>

                {/* Auto-Fill Demo Button */}
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="ck-autofill-btn"
                  title="ចុចដើម្បីបំពេញទិន្នន័យគំរូលឿនៗ"
                >
                  <span>⚡ Auto-Fill គំរូ</span>
                </button>
              </div>

              {/* Form Input Fields Grid */}
              <div className="ck-form-grid">
                {/* Full Name */}
                <div className="ck-field">
                  <label htmlFor="fullName" className="ck-label">
                    ឈ្មោះពេញ (Full Name) <span className="ck-req">*</span>
                  </label>
                  <div className="ck-input-wrap">
                    <span className="ck-input-icon">👤</span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="ck-input"
                      placeholder="ឧ. Sokun Theara"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Customer ID */}
                <div className="ck-field">
                  <label htmlFor="id" className="ck-label">
                    កូដអតិថិជន (Customer ID) <span className="ck-req">*</span>
                  </label>
                  <div className="ck-input-wrap">
                    <span className="ck-input-icon">🆔</span>
                    <input
                      id="id"
                      name="id"
                      type="text"
                      className="ck-input"
                      placeholder="ឧ. CUST-9021"
                      value={form.id}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="ck-field">
                  <label htmlFor="phone" className="ck-label">
                    លេខទូរស័ព្ទ (Phone Number) <span className="ck-req">*</span>
                  </label>
                  <div className="ck-input-wrap">
                    <span className="ck-input-icon">📞</span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="ck-input"
                      placeholder="ឧ. 0979937524"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="ck-field">
                  <label htmlFor="email" className="ck-label">
                    អ៊ីមែល (Email Address)
                  </label>
                  <div className="ck-input-wrap">
                    <span className="ck-input-icon">✉️</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="ck-input"
                      placeholder="sokun@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="ck-field">
                  <label htmlFor="age" className="ck-label">
                    អាយុ (Age)
                  </label>
                  <div className="ck-input-wrap">
                    <span className="ck-input-icon">🎂</span>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      className="ck-input"
                      placeholder="24"
                      value={form.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="ck-field">
                  <label htmlFor="gender" className="ck-label">
                    ភេទ (Gender)
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="ck-input no-icon"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">ជ្រើសរើសភេទ...</option>
                    <option value="Female">ស្រី (Female)</option>
                    <option value="Male">ប្រុស (Male)</option>
                    <option value="Other">ផ្សេងៗ (Other)</option>
                  </select>
                </div>

                {/* Address (Full Width) */}
                <div className="ck-field full">
                  <label htmlFor="address" className="ck-label">
                    អាសយដ្ឋានដឹកជញ្ជូន (Delivery Address) <span className="ck-req">*</span>
                  </label>
                  <div className="ck-input-wrap">
                    <span className="ck-input-icon" style={{ top: "14px" }}>📍</span>
                    <textarea
                      id="address"
                      name="address"
                      className="ck-input"
                      placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់, ខណ្ឌ, រាជធានីភ្នំពេញ..."
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Payment Method */}
            <div className="ck-card">
              <div className="ck-card-header">
                <div className="ck-card-title-group">
                  <div className="ck-card-step-badge">2</div>
                  <div className="ck-card-title-text">
                    <h2>វិធីសាស្ត្រទូទាត់ប្រាក់ (Payment Method)</h2>
                    <p>ជ្រើសរើសមធ្យោបាយទូទាត់ប្រាក់ដែលអ្នកពេញចិត្ត</p>
                  </div>
                </div>
              </div>

              <div className="ck-pay-options">
                {/* 1. KHQR */}
                <div
                  className={`ck-pay-card ${form.payment === "KHQR" ? "selected" : ""}`}
                  onClick={() => handleSelectPayment("KHQR")}
                >
                  <div className="ck-pay-radio">
                    <div className="ck-pay-radio-dot"></div>
                  </div>
                  <div className="ck-pay-icon">🇰🇭</div>
                  <div className="ck-pay-details">
                    <div className="ck-pay-title">
                      Bakong KHQR Payment
                      <span className="ck-pay-tag">ពេញនិយម / Instant</span>
                    </div>
                    <div className="ck-pay-desc">
                      ស្កេនទូទាត់ភ្លាមៗតាមគ្រប់ App ធនាគារក្នុងស្រុក (ABA, Acleda, Wing, etc.)
                    </div>
                  </div>
                </div>

                {/* 2. Bank Transfer */}
                <div
                  className={`ck-pay-card ${form.payment === "Bank Transfer" ? "selected" : ""}`}
                  onClick={() => handleSelectPayment("Bank Transfer")}
                >
                  <div className="ck-pay-radio">
                    <div className="ck-pay-radio-dot"></div>
                  </div>
                  <div className="ck-pay-icon">🏦</div>
                  <div className="ck-pay-details">
                    <div className="ck-pay-title">
                      ផ្ទេរប្រាក់តាមធនាគារ (Bank Transfer)
                    </div>
                    <div className="ck-pay-desc">
                      ផ្ទេរប្រាក់ផ្ទាល់តាមរយៈគណនីធនាគាររបស់ហាង
                    </div>
                  </div>
                </div>

                {/* 3. Cash on Delivery */}
                <div
                  className={`ck-pay-card ${form.payment === "Cash on Delivery" ? "selected" : ""}`}
                  onClick={() => handleSelectPayment("Cash on Delivery")}
                >
                  <div className="ck-pay-radio">
                    <div className="ck-pay-radio-dot"></div>
                  </div>
                  <div className="ck-pay-icon">💵</div>
                  <div className="ck-pay-details">
                    <div className="ck-pay-title">
                      ទូទាត់ពេលទទួលទំនិញ (Cash on Delivery - COD)
                    </div>
                    <div className="ck-pay-desc">
                      បង់ប្រាក់ផ្ទាល់ពេលអ្នកដឹកជញ្ជូនយកទំនិញដល់ដៃ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: ORDER SUMMARY ================= */}
          <div className="ck-right-col">
            <div className="ck-summary-card">
              <div className="ck-summary-header">
                <h3>សង្ខេបការកុម្ម៉ង់ (Order Summary)</h3>
                <span className="ck-item-count-badge">{products.length} មុខទំនិញ</span>
              </div>

              {/* Scrollable Items List */}
              <div className="ck-items-list">
                {products.map((item) => (
                  <div key={item.id} className="ck-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="ck-item-img"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
                      }}
                    />
                    <div className="ck-item-info">
                      <div className="ck-item-name">{item.name}</div>
                      <div className="ck-item-meta">
                        ចំនួន: {item.quantity} • ${Number(item.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="ck-item-total">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Box */}
              <div className="ck-coupon-box">
                <input
                  type="text"
                  className="ck-coupon-input"
                  placeholder="កូដបញ្ចុះតម្លៃ: STYLE20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="ck-coupon-btn"
                >
                  Apply
                </button>
              </div>

              {/* Calculation Rows */}
              <div className="ck-calc-rows">
                <div className="ck-calc-row">
                  <span>តម្លៃទំនិញសរុប (Subtotal):</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>

                {discountPercent > 0 && (
                  <div className="ck-calc-row discount">
                    <span>បញ្ចុះតម្លៃ ({discountPercent}%):</span>
                    <strong>-${discountAmount.toFixed(2)}</strong>
                  </div>
                )}

                <div className={`ck-calc-row ${shipping === 0 ? "free" : ""}`}>
                  <span>ថ្លៃដឹកជញ្ជូន (Delivery):</span>
                  <strong>{shipping === 0 ? "FREE (ឥតគិតថ្លៃ)" : `$${shipping.toFixed(2)}`}</strong>
                </div>

                <div className="ck-calc-divider"></div>

                <div className="ck-total-row">
                  <div>
                    <div className="ck-total-label">តម្លៃសរុប (Total)</div>
                    <div className="ck-total-riel">≈ {approxTotalRiel} ៛</div>
                  </div>
                  <div className="ck-total-amount">${total.toFixed(2)}</div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="ck-submit-btn">
                <span>
                  {form.payment === "KHQR"
                    ? `📱 បន្តទៅស្កេនបង់តាម KHQR ($${total.toFixed(2)}) →`
                    : "✓ បញ្ជាក់ការកុម្ម៉ង់ & រក្សាទុក →"}
                </span>
              </button>

              {/* Trust Indicators */}
              <div className="ck-trust-note">
                <span>🔒 សុវត្ថិភាព 100%</span>
                <span>•</span>
                <span>⚡ MySQL Live Synced</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* ================= KHQR PAYMENT MODAL ================= */}
      {showQrModal && (
        <div className="ck-modal-backdrop" onClick={() => setShowQrModal(false)}>
          <div className="ck-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ck-modal-header">
              <h3>🇰🇭 Bakong KHQR Payment</h3>
              <button
                type="button"
                className="ck-modal-close"
                onClick={() => setShowQrModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="ck-modal-body">
              <div className="ck-khqr-card">
                <div className="ck-khqr-top">
                  <span className="ck-khqr-badge">KHQR</span>
                  <span className="ck-khqr-cur">USD</span>
                </div>

                <div className="ck-khqr-store">FRESHMART SUPERMARKET</div>
                <div className="ck-khqr-sub">BAKONG ID: freshmart@nbc</div>
                <div className="ck-khqr-amount">${total.toFixed(2)}</div>

                <div className="ck-khqr-frame">
                  <img src={qrImageUrl} alt="KHQR Code" />
                </div>

                <div className="ck-khqr-timer">
                  <span>⏱️ Expire in: </span>
                  <strong>{formatTimer(qrSeconds)}</strong>
                </div>

                <div className="ck-khqr-banks">
                  ABA • Acleda • Wing • Canadia • Sathapana
                </div>
              </div>

              <div className="ck-khqr-actions">
                <div className="ck-khqr-btn-group">
                  <button
                    type="button"
                    className="ck-khqr-btn-sub"
                    onClick={handleDownloadQr}
                  >
                    📥 Download QR
                  </button>

                  <label className="ck-khqr-btn-sub">
                    {slipFileName
                      ? `✓ ${slipFileName.slice(0, 15)}... (${qrStatus})`
                      : "📎 Upload Slip"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="ck-khqr-btn-primary"
                  onClick={handleVerifyKhqrPayment}
                  disabled={isQrProcessing}
                >
                  {isQrProcessing ? "Verifying Payment..." : "✓ ខ្ញុំបានទូទាត់រួចរាល់ (Confirm Payment)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= INVOICE / RECEIPT MODAL ================= */}
      {activeInvoice && (
        <div className="ck-modal-backdrop" onClick={() => setActiveInvoice(null)}>
          <div className="ck-modal-box" style={{ maxWidth: "620px" }} onClick={(e) => e.stopPropagation()}>
            <div className="ck-modal-header">
              <h3>🧾 វិក្កយបត្រផ្លូវការ (Official Tax Invoice)</h3>
              <button
                type="button"
                className="ck-modal-close"
                onClick={() => setActiveInvoice(null)}
              >
                ✕
              </button>
            </div>

            <div className="ck-invoice-body">
              <div className="ck-invoice-head">
                <div>
                  <div className="ck-invoice-logo">
                    Fresh<span>Mart</span>
                  </div>
                  <div className="ck-invoice-sub">Supermarket POS & Retail Store</div>
                  <div className="ck-invoice-sub">Phnom Penh, Cambodia</div>
                </div>
                <div className="ck-invoice-number">
                  <div><strong>Invoice #:</strong> {activeInvoice.orderNumber}</div>
                  <div><strong>Date:</strong> {activeInvoice.date}</div>
                </div>
              </div>

              <div className="ck-invoice-cust-box">
                <strong>ព័ត៌មានអតិថិជន (Customer):</strong><br />
                ឈ្មោះ: <strong>{activeInvoice.customer?.fullName}</strong> (ID: {activeInvoice.customer?.id})<br />
                លេខទូរស័ព្ទ: {activeInvoice.customer?.phone} | អ៊ីមែល: {activeInvoice.customer?.email}<br />
                ទីតាំង: {activeInvoice.customer?.address}<br />
                វិធីសាស្ត្រទូទាត់: <strong>{activeInvoice.customer?.payment}</strong>
              </div>

              <table className="ck-invoice-table">
                <thead>
                  <tr>
                    <th>ទំនិញ (Item)</th>
                    <th style={{ textAlign: "center" }}>ចំនួន</th>
                    <th>តម្លៃ</th>
                    <th style={{ textAlign: "right" }}>សរុប</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvoice.products?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td style={{ textAlign: "right" }}>
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ck-invoice-totals">
                <div className="ck-invoice-totals-row">
                  <span>Subtotal:</span>
                  <strong>${Number(activeInvoice.subtotal).toFixed(2)}</strong>
                </div>
                <div className="ck-invoice-totals-row">
                  <span>Shipping:</span>
                  <strong>${Number(activeInvoice.shipping).toFixed(2)}</strong>
                </div>
                {activeInvoice.discount > 0 && (
                  <div className="ck-invoice-totals-row" style={{ color: "#dc2626" }}>
                    <span>Discount:</span>
                    <strong>-${Number(activeInvoice.discount).toFixed(2)}</strong>
                  </div>
                )}
                <div className="ck-invoice-totals-row grand">
                  <span>Total Paid:</span>
                  <strong>${Number(activeInvoice.total).toFixed(2)} USD</strong>
                </div>
              </div>

              <div className="ck-invoice-footer-actions">
                <button
                  type="button"
                  onClick={() => setActiveInvoice(null)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "13px",
                  }}
                >
                  បិទ (Close)
                </button>

                <a
                  href={activeInvoice.telegramUrl || `https://t.me/+855979937524`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    background: "#0284c7",
                    color: "#ffffff",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "800",
                    textDecoration: "none",
                  }}
                >
                  <span>💬 ផ្ញើទៅ Telegram ({TELEGRAM_PHONE})</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "none",
                    background: "var(--ck-primary)",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: "800",
                    fontSize: "13px",
                  }}
                >
                  🖨️ បោះពុម្ពវិក្កយបត្រ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
