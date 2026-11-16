# 🛍️ FreshMart Supermarket & POS System (Projeck Products Intern)

### Full Stack Web Development Project

A modern full-stack web application built with React.js, PHP, and MySQL. Features a modern online supermarket storefront and an enterprise-grade Point-of-Sale (POS) & Admin Dashboard.

---

## 🚀 Tech Stack

| Frontend | Backend | Database |
|---|---|---|
| React.js (v19) | PHP REST API | MySQL Database |
| JavaScript / JSX | Apache / XAMPP | Local & Cloud Storage Sync |
| Modern CSS / Responsive | Telegram Bot / Chat Integration | |

---

## ✨ Features

- 🏠 **Home Page**: Featured fresh products, hero banners, category filters, and quick product modals.
- 🛍️ **Products Catalog**: Complete grocery product listings with live search and price formatting.
- 🛒 **Shopping Cart**: Real-time quantity adjustments, cart totals, and item removals.
- 💳 **Cashier & POS Checkout (`/checkout`)**: Multi-step checkout with KHQR Bakong, ABA Bank Transfer, and Cash on Delivery. Automatic tax invoice generation and instant Telegram order notifications.
- 📊 **Enterprise Admin Dashboard (`/admin`)**:
  - Protected with PIN security (**Default PIN: `1234`** or `admin`).
  - Real-time revenue KPI metrics, order volume tracking, and average order value.
  - Multi-tab navigation: Orders Management, Sales Analytics, and Top Selling Products ranking.
  - Search & filter orders by customer name, phone number, order number, payment type, and status.
  - Official Tax Invoice view with print support (`window.print()`) and direct Telegram notification link.
  - Export all orders directly to Excel / CSV file.
  - Cloud Live Demo Mode for hosting demonstrations + MySQL local sync when running with Apache/PHP.

---

## 🔑 Admin Credentials

- **URL**: `/admin`
- **Default PIN Code**: `1234` (or `admin`)

---

## 📁 Project Structure

```text
projeck-products-intern/
│
├── public/
│   ├── _redirects         # SPA routing redirects for Netlify/Cloudflare
│   ├── favicon.ico
│   └── index.html         # Google Fonts & metadata
│
├── src/
│   ├── components/        # Modals and shared UI components
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Home.jsx
│   │   └── Products.jsx
│   ├── utils/
│   ├── App.js
│   └── index.js
│
├── vercel.json            # SPA routing rewrite for Vercel
└── README.md
```

---

## ⚙️ How to Run

### 1. Clone Repository

```bash
git clone https://github.com/jumnor132-cyber/projeck-products-intern.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start React Development Server

```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### 4. Build for Production / Hosting

```bash
npm run build
```
The optimized build folder is ready to deploy directly to Vercel, Netlify, Render, or GitHub Pages.

---

## 🛠️ Technologies

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 👨‍💻 About Developer

**Full Stack Web Developer Intern**

Interested in developing modern web applications using React.js, PHP, and MySQL.

---

⭐ Thank you for visiting my project!
