# 🥛 Milky Hug POS System - Technical & Business Requirements

This document outlines the architecture and functional requirements for the "Milky Hug" Dairy Products POS system.

---

## 1. Project Overview
**Milky Hug** is a dairy-based manufacturing company with its own outlets. The goal is to build a high-performance, offline-first POS system to manage inventory transfers from manufacturing to outlets, handle sales, and generate automated reports.

---

## 2. User Roles & Access Control

### 🔐 Admin Role
* **Product Management:** Add, edit, or delete dairy products (Name, Price, Category, SKU).
* **User Management:** Create new user accounts and reset passwords.
* **Advanced Reports:** Access to full historical sales and inventory logs.
* **System Configuration:** Set the destination email for daily reports.

### 👤 User (Staff) Role
* **Inventory Inward:** Add finished goods coming from the factory into the shop inventory.
* **POS Interface:** Scan/Select products, process sales, and print receipts.
* **Inventory Lookup:** Check current stock levels in real-time.
* **Daily Close:** Trigger the end-of-day report and backup.

---

## 3. Functional Requirements

### 📦 Inventory Management
* **Factory-to-Outlet Sync:** Ability to increase stock levels when new dairy batches arrive.
* **Auto-Deduction:** Real-time stock reduction upon every successful sale/billing.
* **Stock Alerts:** Visual indicators for low-stock items.

### 🧾 POS & Billing
* **Search/Select:** Quick product selection via UI buttons or search bar.
* **Billing Engine:** Calculate totals, taxes (if any), and change to be returned.
* **Print Support:** Generate a clean, formatted bill for thermal printers.

### 📊 Reporting & Automation (Crucial)
* **Daily Email Report:** At the end of the day, a summary (Total Sales, Items Sold, Remaining Stock) must be sent to the pre-configured email.
* **Local Excel Backup:** The system must automatically generate and trigger a download of an `.xlsx` or `.csv` file for offline record-keeping.

---

## 4. Technical Stack & Tools

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | HTML5, Tailwind CSS |
| **Logic/State Management** | Vanilla JavaScript (ES6+) |
| **Local Database** | **Dexie.js** (Wrapper for IndexedDB) |
| **Excel Export** | SheetJS (xlsx.full.min.js) |
| **Email Integration** | EmailJS or a dedicated Backend API |
| **Offline Capability** | LocalStorage for session, Dexie for persistent data |

---

## 5. Database Schema (Dexie.js)

```javascript
// Database definition
const db = new Dexie('MilkyHugDB');
db.version(1).stores({
    products: '++id, name, price, stock',
    sales: '++id, timestamp, total, items',
    users: '++id, username, password, role'
});