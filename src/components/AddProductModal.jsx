import React, { useState, useRef } from "react";
import { MART_CATEGORIES, addMartProduct } from "../utils/products";

const PRESET_IMAGES = [
  {
    name: "Coca-Cola",
    icon: "🥤",
    url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Fresh Milk",
    icon: "🥛",
    url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Noodles / Ramen",
    icon: "🍜",
    url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Fresh Apple",
    icon: "🍎",
    url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Potato Chips",
    icon: "🍿",
    url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Fresh Croissant",
    icon: "🥐",
    url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Cold Brew Coffee",
    icon: "☕",
    url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Orange Juice",
    icon: "🧃",
    url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Fresh Bread",
    icon: "🍞",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Sweet Oranges",
    icon: "🍊",
    url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=700&q=80",
  },
];

function AddProductModal({ isOpen, onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    nameKh: "",
    name: "",
    category: "drinks",
    price: "",
    originalPrice: "",
    unit: "កំប៉ុង",
    stock: "50",
    barcode: "",
    badge: "ទំនិញថ្មី ✨",
    image: "",
    description: "",
  });

  // Image Input Mode: "upload" (Choose file from computer) | "url" (Paste link) | "presets" (Quick mart presets)
  const [imageInputMode, setImageInputMode] = useState("upload");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSelectPreset = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
    setUploadedFileName("");
  };

  const handleGenerateBarcode = () => {
    const generated = `8850${Math.floor(10000000 + Math.random() * 90000000)}`;
    setFormData((prev) => ({ ...prev, barcode: generated }));
  };

  // Image Processing & Compression (Resizes to max 800px so it loads instantly and saves safely in localStorage)
  const processAndSetImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("សូមជ្រើសរើសឯកសារប្រភេទរូបភាព (JPG, PNG, WebP)!");
      return;
    }

    setIsProcessingImage(true);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to downscale large phone/camera images
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

        setFormData((prev) => ({
          ...prev,
          image: dataUrl,
        }));
        setUploadedFileName(file.name);
        setIsProcessingImage(false);
      };

      img.onerror = () => {
        setIsProcessingImage(false);
        setError("មិនអាចបើករូបភាពនេះបានទេ។ សូមសាកល្បងរូបភាពផ្សេង!");
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      setIsProcessingImage(false);
      setError("មានបញ្ហាក្នុងការអានឯកសាររូបភាព!");
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndSetImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nameKh.trim() && !formData.name.trim()) {
      setError("សូមបញ្ចូលឈ្មោះទំនិញ (Product Name)!");
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("សូមបញ្ចូលតម្លៃទំនិញអោយបានត្រឹមត្រូវ (Price > $0)!");
      return;
    }

    const categoryObj = MART_CATEGORIES.find((c) => c.id === formData.category);
    const categoryLabel = categoryObj ? categoryObj.nameKh : "ទំនិញទូទៅ";

    // Fallback image if user didn't choose any image
    const finalImage =
      formData.image.trim() ||
      PRESET_IMAGES[0].url;

    const newProduct = {
      name: formData.name.trim() || formData.nameKh.trim(),
      nameKh: formData.nameKh.trim() || formData.name.trim(),
      category: formData.category,
      categoryLabel,
      price: priceNum,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : priceNum * 1.2,
      unit: formData.unit.trim() || "កញ្ចប់",
      stock: parseInt(formData.stock, 10) || 50,
      barcode: formData.barcode.trim() || `8850${Math.floor(10000000 + Math.random() * 90000000)}`,
      badge: formData.badge.trim() || "ទំនិញថ្មី ✨",
      image: finalImage,
      description: formData.description.trim() || "ទំនិញគុណភាពខ្ពស់ក្នុងម៉ាត។",
    };

    const added = addMartProduct(newProduct);
    if (onProductAdded) {
      onProductAdded(added);
    }
    onClose();
  };

  // Determine current image source label
  const isBase64Upload = formData.image.startsWith("data:image");
  const isPresetImage = PRESET_IMAGES.some((p) => p.url === formData.image);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "660px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e2e8f0",
          animation: "modalFadeIn 0.25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(to right, #f0fdf4, #ffffff)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "#059669",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              🛒
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                ➕ បន្ថែមទំនិញថ្មីក្នុងម៉ាត (Add Mart Product)
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
                ជ្រើសរើសរូបភាពពីម៉ាស៊ីន/កុំព្យូទ័រ ឬដាក់តាម Link រួចដាក់លក់ក្នុងម៉ាតភ្លាមៗ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "18px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "18px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Product Names */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                ឈ្មោះទំនិញ (ភាសាខ្មែរ) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                name="nameKh"
                value={formData.nameKh}
                onChange={handleChange}
                placeholder="ឧ. ទឹកក្រូច កូកាកូឡា ត្រជាក់"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                ឈ្មោះជាភាសាអង់គ្លេស (English Name)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Coca-Cola Cold Can"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Category & Unit */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                ប្រភេទក្នុងម៉ាត (Category)
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "#ffffff",
                }}
              >
                {MART_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.nameKh} ({cat.nameEn})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                ឯកតា (Unit / Packaging)
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "#ffffff",
                }}
              >
                <option value="កំប៉ុង 330ml">កំប៉ុង (Can 330ml)</option>
                <option value="ដប 500ml">ដប (Bottle 500ml)</option>
                <option value="ដប 1L">ដបធំ (Bottle 1L)</option>
                <option value="កញ្ចប់ x5">កញ្ចប់ (Pack x5)</option>
                <option value="កញ្ចប់ 180g">កញ្ចប់ (Bag 180g)</option>
                <option value="1 គីឡូក្រាម">គីឡូក្រាម (1 kg)</option>
                <option value="500 ក្រាម">500 ក្រាម (500g)</option>
                <option value="ប្រអប់">ប្រអប់ (Box)</option>
                <option value="ដុំ">ដុំ / នំ (Piece)</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                តម្លៃលក់ ($) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="ឧ. 0.85"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                តម្លៃដើម ($) (បើមាន)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="ឧ. 1.10"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                ស្តុក (Stock Qty)
              </label>
              <input
                type="number"
                min="1"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="ឧ. 50"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Barcode & Promotion Badge */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                  Barcode / លេខកូដទំនិញ
                </label>
                <button
                  type="button"
                  onClick={handleGenerateBarcode}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#059669",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  ⚡ បង្កើតកូដថ្មី
                </button>
              </div>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="885012345678"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "monospace",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                ផ្លាកសញ្ញា (Promotion Tag)
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="ឧ. ទំនិញថ្មី ✨ ឬ Hot Deal 🔥"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* ========================================================== */}
          {/* PRODUCT IMAGE SECTION: UPLOAD FROM DEVICE / URL / PRESETS  */}
          {/* ========================================================== */}
          <div
            style={{
              marginBottom: "20px",
              padding: "18px",
              background: "#f8fafc",
              borderRadius: "16px",
              border: "1.5px solid #e2e8f0",
            }}
          >
            {/* Header with Mode Switching Tabs */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>📸</span>
                  <span>រូបភាពទំនិញ (Product Image)</span>
                </label>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  ជ្រើសរើសវិធីសាស្ត្រដាក់រូបភាពដែលអ្នកចង់បាន
                </span>
              </div>

              {/* 3 Input Mode Tabs */}
              <div
                style={{
                  display: "flex",
                  background: "#e2e8f0",
                  padding: "3px",
                  borderRadius: "10px",
                  gap: "3px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setImageInputMode("upload")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: imageInputMode === "upload" ? "#059669" : "transparent",
                    color: imageInputMode === "upload" ? "#ffffff" : "#475569",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s",
                  }}
                >
                  <span>📁</span>
                  <span>រើសរូបពីម៉ាស៊ីន (Upload)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageInputMode("url")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: imageInputMode === "url" ? "#059669" : "transparent",
                    color: imageInputMode === "url" ? "#ffffff" : "#475569",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s",
                  }}
                >
                  <span>🔗</span>
                  <span>ដាក់ Link URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageInputMode("presets")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: imageInputMode === "presets" ? "#059669" : "transparent",
                    color: imageInputMode === "presets" ? "#ffffff" : "#475569",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s",
                  }}
                >
                  <span>✨</span>
                  <span>រូបគំរូ</span>
                </button>
              </div>
            </div>

            {/* TAB 1: UPLOAD FROM LOCAL DEVICE / COMPUTER */}
            {imageInputMode === "upload" && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    border: isDragging ? "2px dashed #059669" : "2px dashed #cbd5e1",
                    borderRadius: "14px",
                    padding: "24px 16px",
                    textAlign: "center",
                    background: isDragging ? "#ecfdf5" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>
                    {isProcessingImage ? "⏳" : "📁"}
                  </div>

                  <strong style={{ display: "block", fontSize: "14px", color: "#0f172a", marginBottom: "4px" }}>
                    {isProcessingImage
                      ? "កំពុងរៀបចំ និងកែសម្រួលរូបភាព..."
                      : "ចុចទីនេះដើម្បីជ្រើសរើសរូបភាពពីកុំព្យូទ័រ / ទូរស័ព្ទរបស់អ្នក"}
                  </strong>

                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>
                    ឬទម្លាក់ឯកសាររូបភាព (Drag & Drop) ចូលទីនេះ • គាំទ្រ JPG, PNG, GIF, WebP
                  </p>

                  <button
                    type="button"
                    style={{
                      padding: "7px 16px",
                      borderRadius: "8px",
                      border: "1px solid #059669",
                      background: "#ecfdf5",
                      color: "#059669",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>📂 Browse Files (រើសឯកសាររូបភាព)</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LINK URL INPUT */}
            {imageInputMode === "url" && (
              <div>
                <div style={{ position: "relative" }}>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Paste Image URL: https://images.unsplash.com/..."
                    style={{
                      width: "100%",
                      padding: "11px 40px 11px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                    }}
                  />
                  {formData.image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
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
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
                  💡 លោកអ្នកអាចចម្លង Link រូបភាពពី Google, Unsplash ឬ Facebook មកបិទភ្ជាប់ទីនេះបាន។
                </div>
              </div>
            )}

            {/* TAB 3: QUICK MART PRESET IMAGES */}
            {imageInputMode === "presets" && (
              <div>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                  ជ្រើសរើសរូបភាពពិតគំរូលឿនៗ (Quick Mart Presets):
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {PRESET_IMAGES.map((preset) => {
                    const isSelected = formData.image === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid #059669" : "1px solid #cbd5e1",
                          background: isSelected ? "#ecfdf5" : "#ffffff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: isSelected ? "700" : "500",
                          color: isSelected ? "#065f46" : "#334155",
                        }}
                      >
                        <span>{preset.icon}</span>
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LIVE IMAGE PREVIEW CARD */}
            {formData.image && (
              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "1.5px solid #059669",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80";
                    }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                        {uploadedFileName || "រូបភាពដែលបានជ្រើសរើស (Selected Image)"}
                      </strong>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          background: "#ecfdf5",
                          color: "#059669",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          border: "1px solid #a7f3d0",
                        }}
                      >
                        {isBase64Upload
                          ? "📁 រូបភាពពីកុំព្យូទ័រ"
                          : isPresetImage
                          ? "✨ រូបភាពគំរូ"
                          : "🔗 រូបភាពពី Link"}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>
                      ✓ រូបភាពរួចរាល់សម្រាប់ដាក់លក់ក្នុងម៉ាត
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  {imageInputMode === "upload" && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        background: "#f8fafc",
                        color: "#475569",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      🔄 ប្តូររូប
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "1px solid #fecaca",
                      background: "#fef2f2",
                      color: "#dc2626",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    ✕ លុប
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "22px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
              ការពិពណ៌នាទំនិញ (Description)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="ព័ត៌មានលម្អិតអំពីទំនិញ គុណភាព ឬប្រភពដើម..."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              បោះបង់ (Cancel)
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "#ffffff",
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>✓ រក្សាទុក & ដាក់លក់ក្នុងម៉ាត</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
