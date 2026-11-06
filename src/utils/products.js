import { useState, useEffect } from "react";

export const MART_STORAGE_KEY = "mart_supermarket_products_v2";

export const MART_CATEGORIES = [
  { id: "all", nameKh: "ទាំងអស់", nameEn: "All Items", icon: "🛒" },
  { id: "drinks", nameKh: "ភេសជ្ជៈ & ទឹក", nameEn: "Beverages", icon: "🥤" },
  { id: "food", nameKh: "អាហារ & មីកញ្ចប់", nameEn: "Food & Noodles", icon: "🍜" },
  { id: "fruits", nameKh: "ផ្លែឈើ & បន្លែស្រស់", nameEn: "Fresh Produce", icon: "🍎" },
  { id: "snacks", nameKh: "នំចំណី & អាហារសម្រន់", nameEn: "Snacks", icon: "🍿" },
  { id: "bakery", nameKh: "នំបុ័ង & ទឹកដោះគោ", nameEn: "Bakery & Dairy", icon: "🥖" },
  { id: "household", nameKh: "គ្រឿងប្រើប្រាស់", nameEn: "Household & Care", icon: "🧴" },
];

export const DEFAULT_MART_PRODUCTS = [
  {
    id: "MART-001",
    name: "Coca-Cola Classic Cold Can",
    nameKh: "ទឹកក្រូច កូកាកូឡា កំប៉ុងត្រជាក់",
    category: "drinks",
    categoryLabel: "ភេសជ្ជៈ & ទឹក",
    price: 0.75,
    originalPrice: 0.90,
    unit: "កំប៉ុង 330ml",
    barcode: "885012400123",
    stock: 120,
    badge: "Hot Deal 🔥",
    rating: 4.9,
    reviews: 320,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=80",
    description: "កូកាកូឡាកំប៉ុងត្រជាក់ស្រស់ស្រាយ រសជាតិដើម ពេញនិយមបំផុតក្នុងម៉ាត។",
  },
  {
    id: "MART-002",
    name: "Meiji Fresh Pasteurized Milk",
    nameKh: "ទឹកដោះគោស្រស់ Meiji កម្រិតគុណភាពខ្ពស់",
    category: "bakery",
    categoryLabel: "នំបុ័ង & ទឹកដោះគោ",
    price: 2.80,
    originalPrice: 3.20,
    unit: "ដប 946ml",
    barcode: "885012400124",
    stock: 45,
    badge: "Best Seller 🥛",
    rating: 4.9,
    reviews: 180,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80",
    description: "ទឹកដោះគោសុទ្ធ 100% រសជាតិឆ្ងាញ់ធម្មជាតិ សម្បូរដោយជាតិកាល់ស្យូម។",
  },
  {
    id: "MART-003",
    name: "Mama Shrimp Creamy Tom Yum Noodles",
    nameKh: "មីម៉ាម៉ា រសជាតិតុងយាំបង្គាទឹកខាប់ (កញ្ចប់ x5)",
    category: "food",
    categoryLabel: "អាហារ & មីកញ្ចប់",
    price: 1.60,
    originalPrice: 1.95,
    unit: "កញ្ចប់ x5",
    barcode: "885012400125",
    stock: 85,
    badge: "ពេញនិយម 🍜",
    rating: 4.8,
    reviews: 240,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    description: "មីម៉ាម៉ាតុងយាំរសជាតិហឹរជូរដិតដល់ សរសៃស្វិតឆ្ងាញ់ កញ្ចប់សន្សំសំចៃ។",
  },
  {
    id: "MART-004",
    name: "Crisp Red Fuji Apples",
    nameKh: "ផ្លែប៉ោមក្រហម ហ្វូជី ផ្អែមស្រួយស្រស់ៗ",
    category: "fruits",
    categoryLabel: "ផ្លែឈើ & បន្លែស្រស់",
    price: 3.20,
    originalPrice: 3.80,
    unit: "1 គីឡូក្រាម",
    barcode: "885012400126",
    stock: 35,
    badge: "ស្រស់ៗ 100% 🍎",
    rating: 5.0,
    reviews: 95,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80",
    description: "ផ្លែប៉ោមហ្វូជីក្រហមស្រស់ ផ្អែមឆ្ងាញ់ គ្មានជាតិគីមី នាំចូលគុណភាពខ្ពស់។",
  },
  {
    id: "MART-005",
    name: "Lay's Classic Salted Potato Chips",
    nameKh: "ដំឡូងបារាំងបំពង Lay's Classic កញ្ចប់ធំ",
    category: "snacks",
    categoryLabel: "នំចំណី & អាហារសម្រន់",
    price: 1.90,
    originalPrice: 2.30,
    unit: "កញ្ចប់ 180g",
    barcode: "885012400127",
    stock: 60,
    badge: "បញ្ចុះតម្លៃ 15% 🍿",
    rating: 4.7,
    reviews: 140,
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=700&q=80",
    description: "ដំឡូងបំពងស្រួយឆ្ងាញ់ រសជាតិដើម ញ៉ាំលេងជាមួយភេសជ្ជៈយ៉ាងជក់ចិត្ត។",
  },
  {
    id: "MART-006",
    name: "French Golden Butter Croissant",
    nameKh: "នំបុ័ងខ្វាសង់ប័រស្រស់ ក្តៅៗឈ្ងុយឆ្ងាញ់",
    category: "bakery",
    categoryLabel: "នំបុ័ង & ទឹកដោះគោ",
    price: 1.25,
    originalPrice: 1.50,
    unit: "ដុំ 1 នំ",
    barcode: "885012400128",
    stock: 28,
    badge: "ដុតថ្មីរាល់ថ្ងៃ 🥐",
    rating: 4.9,
    reviews: 88,
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80",
    description: "នំបុ័ងខ្វាសង់ដុតថ្មីៗរាល់ព្រឹក ស្រទាប់ស្រួយខាងក្រៅ ទន់ឈ្ងុយប័រខាងក្នុង។",
  },
  {
    id: "MART-007",
    name: "Iced Cold Brew Latte Coffee",
    nameKh: "កាហ្វេ Cold Brew ឡាតេ ត្រជាក់ឈ្ងុយពិសេស",
    category: "drinks",
    categoryLabel: "ភេសជ្ជៈ & ទឹក",
    price: 1.45,
    originalPrice: 1.80,
    unit: "កំប៉ុង 250ml",
    barcode: "885012400129",
    stock: 50,
    badge: "ពេញនិយម ☕",
    rating: 4.8,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80",
    description: "កាហ្វេ Cold Brew ឆុងស្រស់ៗ រសជាតិដិតជាប់មាត់ ជួយអោយអារម្មណ៍ស្រស់ស្រាយ។",
  },
  {
    id: "MART-008",
    name: "Sweet Juicy Navel Oranges",
    nameKh: "ផ្លែក្រូចពោធិ៍សាត់ផ្អែមឆ្ងាញ់ ស្រស់ៗពីចម្ការ",
    category: "fruits",
    categoryLabel: "ផ្លែឈើ & បន្លែស្រស់",
    price: 2.60,
    originalPrice: 3.10,
    unit: "1 គីឡូក្រាម",
    barcode: "885012400130",
    stock: 40,
    badge: "វីតាមីន C 🍊",
    rating: 4.8,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=700&q=80",
    description: "ក្រូចស្រស់សម្បូរដោយជាតិទឹក និងវីតាមីន C ជួយសុខភាព និងបង្កើនថាមពល។",
  },
  {
    id: "MART-009",
    name: "KitKat Crisp Wafer Milk Chocolate",
    nameKh: "សូកូឡា KitKat 4-Finger រសជាតិទឹកដោះគោ",
    category: "snacks",
    categoryLabel: "នំចំណី & អាហារសម្រន់",
    price: 0.95,
    originalPrice: 1.20,
    unit: "កញ្ចប់ 4-Finger",
    barcode: "885012400131",
    stock: 90,
    badge: "ទិញ 2 ថែម 1 🍫",
    rating: 4.9,
    reviews: 165,
    image:
      "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=700&q=80",
    description: "នំស្រួយស្រោបសូកូឡាទឹកដោះគោក្លិនឈ្ងុយ សម្រាកញ៉ាំ KitKat បង្កើនភាពសប្បាយ។",
  },
  {
    id: "MART-010",
    name: "Natural Cold Mineral Water Bottle",
    nameKh: "ទឹកបរិសុទ្ធធម្មជាតិ ដបធំ ត្រជាក់ស្រស់",
    category: "drinks",
    categoryLabel: "ភេសជ្ជៈ & ទឹក",
    price: 0.50,
    originalPrice: 0.65,
    unit: "ដប 1500ml",
    barcode: "885012400132",
    stock: 150,
    badge: "ទឹកបរិសុទ្ធ 💧",
    rating: 5.0,
    reviews: 420,
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=700&q=80",
    description: "ទឹកបរិសុទ្ធធម្មជាតិ ឆ្លងកាត់ការចម្រោះកម្រិតស្តង់ដារ សុវត្ថិភាពខ្ពស់ 100%។",
  },
  {
    id: "MART-011",
    name: "Premium Jasmine Fragrant Rice",
    nameKh: "អង្ករផ្កាម្លិះខ្មែរលេខ 1 ក្រអូបទន់ឆ្ងាញ់",
    category: "food",
    categoryLabel: "អាហារ & មីកញ្ចប់",
    price: 5.80,
    originalPrice: 6.80,
    unit: "ការ៉ុង 5kg",
    barcode: "885012400133",
    stock: 25,
    badge: "អង្ករលេខ 1 🌾",
    rating: 5.0,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80",
    description: "អង្ករផ្កាម្លិះថ្មី គ្រាប់វែង ពេលដាំបាយឡើងក្រអូបទន់ឆ្ងាញ់ លំដាប់នាំចេញ។",
  },
  {
    id: "MART-012",
    name: "Fresh Hass Creamy Avocados",
    nameKh: "ផ្លែប័រស្រស់ Hass ពូជល្អ មានជាតិខ្លាញ់ល្អ",
    category: "fruits",
    categoryLabel: "ផ្លែឈើ & បន្លែស្រស់",
    price: 2.90,
    originalPrice: 3.50,
    unit: "500 ក្រាម",
    barcode: "885012400134",
    stock: 30,
    badge: "សុខភាពល្អ 🥑",
    rating: 4.8,
    reviews: 62,
    image:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
    description: "ផ្លែប័រពូជ Hass សាច់ទន់ម៉ត់ រសជាតិឈ្ងុយ ល្អសម្រាប់សុខភាព និងធ្វើសាឡាដ។",
  },
  {
    id: "MART-013",
    name: "Tipco 100% Real Squeezed Orange Juice",
    nameKh: "ទឹកក្រូចច្របាច់សុទ្ធ 100% Tipco គ្មានជាតិស្ករ",
    category: "drinks",
    categoryLabel: "ភេសជ្ជៈ & ទឹក",
    price: 2.30,
    originalPrice: 2.75,
    unit: "ប្រអប់ 1000ml",
    barcode: "885012400135",
    stock: 55,
    badge: "100% ធម្មជាតិ 🧃",
    rating: 4.9,
    reviews: 135,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=80",
    description: "ទឹកក្រូចច្របាច់ស្រស់ៗ 100% គ្មានលាយស្ករ ឬសារធាតុរក្សាទុក សម្បូរវីតាមីន។",
  },
  {
    id: "MART-014",
    name: "Fresh Farm Organic Brown Eggs",
    nameKh: "ស៊ុតមាន់ស្រែស្រស់ៗ កម្រិតគុណភាព A (ប្រអប់ x10)",
    category: "food",
    categoryLabel: "អាហារ & មីកញ្ចប់",
    price: 2.10,
    originalPrice: 2.50,
    unit: "ប្រអប់ 10 គ្រាប់",
    barcode: "885012400136",
    stock: 70,
    badge: "ស៊ុតស្រស់ 🥚",
    rating: 4.9,
    reviews: 182,
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=700&q=80",
    description: "ស៊ុតមាន់ស្រែស្រស់ ប្រមូលរាល់ព្រឹក មិនស្អុយ មិនប្រេះ គុណភាពល្អបំផុត។",
  },
  {
    id: "MART-015",
    name: "Gentle Refreshing Body Wash Pump",
    nameKh: "សាប៊ូដុសខ្លួនក្លិនក្រអូបស្រស់ស្រាយ ដបបូមធំ",
    category: "household",
    categoryLabel: "គ្រឿងប្រើប្រាស់",
    price: 4.20,
    originalPrice: 5.00,
    unit: "ដប 550ml",
    barcode: "885012400137",
    stock: 40,
    badge: "ថែរក្សាស្បែក 🧴",
    rating: 4.8,
    reviews: 84,
    image:
      "https://images.unsplash.com/photo-1608248597359-0050854d924d?auto=format&fit=crop&w=700&q=80",
    description: "សាប៊ូដុសខ្លួនជួយផ្តល់សំណើមដល់ស្បែក ក្លិនក្រអូបស្រស់ស្រាយជាប់បានយូរ។",
  },
  {
    id: "MART-016",
    name: "Ito En Chilled Japanese Green Tea",
    nameKh: "តែបៃតងជប៉ុន Ito En អត់ជាតិស្ករ ត្រជាក់ស្រស់",
    category: "drinks",
    categoryLabel: "ភេសជ្ជៈ & ទឹក",
    price: 1.35,
    originalPrice: 1.60,
    unit: "ដប 500ml",
    barcode: "885012400138",
    stock: 65,
    badge: "គ្មានជាតិស្ករ 🍵",
    rating: 4.9,
    reviews: 147,
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80",
    description: "តែបៃតងសុទ្ធនាំចូលពីជប៉ុន គ្មានជាតិស្ករ ជួយរំលាយអាហារ និងសម្រកទម្ងន់។",
  },
];

export const getMartProducts = () => {
  try {
    const saved = localStorage.getItem(MART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading mart products:", err);
  }

  // Initialize with default
  try {
    localStorage.setItem(MART_STORAGE_KEY, JSON.stringify(DEFAULT_MART_PRODUCTS));
  } catch (err) {}
  return DEFAULT_MART_PRODUCTS;
};

export const saveMartProducts = (items) => {
  try {
    localStorage.setItem(MART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("martProductsUpdated"));
  } catch (err) {
    console.error("Error saving mart products:", err);
  }
};

export const addMartProduct = (newProduct) => {
  const current = getMartProducts();
  const id = newProduct.id || `MART-${Date.now().toString().slice(-5)}`;
  const barcode =
    newProduct.barcode || `8850${Math.floor(10000000 + Math.random() * 90000000)}`;

  const productToAdd = {
    id,
    name: newProduct.name || "Unnamed Item",
    nameKh: newProduct.nameKh || newProduct.name,
    category: newProduct.category || "food",
    categoryLabel:
      newProduct.categoryLabel ||
      (MART_CATEGORIES.find((c) => c.id === newProduct.category)?.nameKh || "ទំនិញទូទៅ"),
    price: Number(newProduct.price) || 1.0,
    originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) * 1.2,
    unit: newProduct.unit || "កញ្ចប់",
    barcode,
    stock: Number(newProduct.stock) || 50,
    badge: newProduct.badge || "ទំនិញថ្មី ✨",
    rating: 5.0,
    reviews: 1,
    image:
      newProduct.image ||
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80",
    description: newProduct.description || "ទំនិញគុណភាពខ្ពស់ក្នុងម៉ាត។",
    isCustom: true,
    addedAt: new Date().toISOString(),
  };

  const updated = [productToAdd, ...current];
  saveMartProducts(updated);
  return productToAdd;
};

export const deleteMartProduct = (id) => {
  const current = getMartProducts();
  const updated = current.filter((item) => item.id !== id);
  saveMartProducts(updated);
  return updated;
};

export const resetMartProducts = () => {
  saveMartProducts(DEFAULT_MART_PRODUCTS);
  return DEFAULT_MART_PRODUCTS;
};

export function useMartProducts() {
  const [products, setProducts] = useState(getMartProducts);

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getMartProducts());
    };

    window.addEventListener("martProductsUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("martProductsUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    products,
    addProduct: addMartProduct,
    deleteProduct: deleteMartProduct,
    resetProducts: resetMartProducts,
    categories: MART_CATEGORIES,
  };
}
