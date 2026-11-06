import { useState, useEffect } from "react";

const CART_STORAGE_KEY = "styleshop_cart";

const DEFAULT_SAMPLE_CART = [
  {
    id: "MART-001",
    name: "ទឹកក្រូច កូកាកូឡា (Coca-Cola Can)",
    category: "drinks",
    price: 0.75,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80",
    sku: "885012400123",
    unit: "កំប៉ុង 330ml",
  },
  {
    id: "MART-002",
    name: "ទឹកដោះគោស្រស់ Meiji Fresh Milk",
    category: "bakery",
    price: 2.80,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80",
    sku: "885012400124",
    unit: "ដប 946ml",
  },
  {
    id: "MART-004",
    name: "ផ្លែប៉ោមក្រហម Fuji Apples (1kg)",
    category: "fruits",
    price: 3.20,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80",
    sku: "885012400126",
    unit: "1 គីឡូក្រាម",
  },
];

export const getCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading cart from localStorage:", e);
  }
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(DEFAULT_SAMPLE_CART)
    );
  } catch (e) {}
  return DEFAULT_SAMPLE_CART;
};

export const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (e) {
    console.error("Error saving cart to localStorage:", e);
  }
};

export const addToCart = (product, quantity = 1) => {
  const current = getCart();
  const existingIndex = current.findIndex((item) => String(item.id) === String(product.id));
  let updated;

  const displayName = product.nameKh
    ? `${product.nameKh} (${product.name})`
    : product.name;

  if (existingIndex > -1) {
    updated = current.map((item, idx) =>
      idx === existingIndex
        ? { ...item, quantity: (item.quantity || 1) + quantity }
        : item
    );
  } else {
    updated = [
      ...current,
      {
        id: product.id,
        name: displayName,
        category: product.categoryLabel || product.category || "General",
        price: Number(product.price),
        quantity: quantity,
        image: product.image,
        sku: product.barcode || product.sku || `SKU-${product.id}`,
        unit: product.unit || "item",
      },
    ];
  }

  saveCart(updated);
  return updated;
};

export const updateCartQuantity = (id, delta) => {
  const current = getCart();
  const updated = current
    .map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + delta } : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(updated);
  return updated;
};

export const removeFromCart = (id) => {
  const current = getCart();
  const updated = current.filter((item) => item.id !== id);
  saveCart(updated);
  return updated;
};

export const clearCart = () => {
  saveCart([]);
  return [];
};

export function useCart() {
  const [cart, setCart] = useState(getCart);

  useEffect(() => {
    const handleUpdate = () => {
      setCart(getCart());
    };

    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const totalQuantity = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return {
    cart,
    setCart,
    totalQuantity,
    subtotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };
}
