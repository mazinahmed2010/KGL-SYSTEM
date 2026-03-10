# 🌾 KGL-System

**Karibu Groceries Ltd – Enterprise Inventory & Sales Management System**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Business Context](#-business-context)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#️-system-architecture)
- [Project Structure](#-project-structure)
- [Database Design](#️-database-design)
- [System Requirements](#-system-requirements)
- [Installation Guide](#-installation-guide)
- [Environment Setup](#⚙️-environment-variables)
- [API Documentation](#-api-documentation)
- [Security Best Practices](#-security-best-practices)
- [Deployment Guide](#️-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📖 Overview

The **KGL-System** is a comprehensive **full-stack inventory and sales management platform** developed for Karibu Groceries Ltd, a wholesale distributor specializing in cereals and agricultural produce across Uganda.

### Problem Solved

Previously, the company relied on manual black book record-keeping, which led to:

- ❌ Data loss and corruption
- ❌ Calculation errors
- ❌ Slow reporting and decision-making
- ❌ Lack of stock visibility across branches
- ❌ Difficulty tracking credit transactions

### Solution Provided

This system **fully digitizes** all operations, enabling:

- ✅ Real-time inventory tracking
- ✅ Automated sales management
- ✅ Efficient procurement workflow
- ✅ Credit transaction monitoring
- ✅ Executive-level analytics

---

## 🏢 Business Context

### Operational Structure

Karibu Groceries Ltd operates **two strategic branches**:

1. **Maganjo Branch** - Primary distribution center
2. **Matugga Branch** - Secondary outlet

### User Roles & Responsibilities

| Role         | Responsibilities                                   |
| ------------ | -------------------------------------------------- |
| **Manager**  | Inventory management, procurement, staff oversight |
| **Agent**    | Sales transactions, customer interactions          |
| **Director** | Strategic analytics, business intelligence         |

### System Capabilities

- ✅ Multi-branch inventory synchronization
- ✅ Real-time stock visibility across all branches
- ✅ Procurement recording with dealer tracking
- ✅ Credit management for trusted customers
- ✅ Role-based reporting & analytics

---

## ✨ Key Features

### 🔐 Authentication & Authorization

**Secure, role-based access control**

- JWT token-based authentication
- bcrypt password hashing with salt rounds (10)
- Session persistence with refresh tokens
- Role-based route guards
- Password reset functionality

**Supported Roles:**

- `Manager` - Full system access except analytics
- `Agent` - Sales and inventory view permissions
- `Director` - Read-only analytics dashboard

---

### 📦 Procurement Management

**Track and manage supplier purchases**

- Dealer information validation (contact, NIN)
- Minimum procurement quantity enforcement
- Automatic inventory synchronization
- Branch-specific procurement tracking
- Procurement history and audit logs
- Supplier performance metrics

**Validation Rules:**

- Minimum quantity: 100 units per transaction
- Valid contact number format required
- Dealer ID must be unique per branch

---

### 💰 Sales Terminal

**Fast, flexible point-of-sale system**

- Real-time stock availability checking
- Quick preset quantities for common orders
- Multiple payment method support
- Transaction receipt generation
- Daily sales reporting

**Payment Methods Supported:**

- 💵 Cash
- 📱 Mobile Money (MTN, Airtel)
- 🏦 Bank Transfer
- 📋 On-Credit (eligible customers only)

---

### 💳 Credit Sales System

**Manage credit transactions with full oversight**

- National ID (NIN) validation
- Credit limit management
- Due date tracking with alerts
- Outstanding balance monitoring
- Overdue payment notifications
- Payment receipt generation

**Features:**

- Automatic credit eligibility verification
- Grace period configuration
- Late payment interest calculation
- Credit history tracking

---

### 📊 Inventory Management

**Complete stock control and optimization**

- Real-time stock level monitoring
- Low stock alerts (configurable thresholds)
- Out-of-stock notifications
- Product categorization
- Stock valuation
- Inventory history tracking
- Movement analytics

**Alert Types:**

- 🔴 Critical: Stock below 50 units
- 🟡 Warning: Stock below 200 units
- 🟢 Optimal: Stock above 500 units

---

### 👑 Executive Dashboard

**Business intelligence for decision-makers**

- Total sales revenue (daily, weekly, monthly, yearly)
- Stock health metrics and trends
- Branch performance comparison
- Key performance indicators (KPIs)
- Customer analytics
- Payment method distribution
- Credit portfolio overview

**Accessible to:** Directors only (read-only)

---

## 🛠️ Technology Stack

### Frontend Architecture

| Technology             | Version | Purpose                   |
| ---------------------- | ------- | ------------------------- |
| **Vue.js**             | 3.x     | Reactive UI framework     |
| **Vue Router**         | 4.x     | SPA routing & navigation  |
| **Pinia**              | Latest  | State management store    |
| **Axios**              | 1.x     | HTTP client for API calls |
| **Vite**               | 4.x     | Lightning-fast build tool |
| **Tailwind CSS**       | 3.x     | Utility-first styling     |
| **Font Awesome**       | 6.x     | Icon library              |
| **Vue Toastification** | 2.x     | Toast notifications       |

### Backend Architecture

| Technology            | Version | Purpose               |
| --------------------- | ------- | --------------------- |
| **Node.js**           | 18.x+   | JavaScript runtime    |
| **Express.js**        | 4.x     | REST API framework    |
| **MongoDB**           | 6.x     | NoSQL database        |
| **Mongoose**          | 7.x     | MongoDB ODM           |
| **JWT**               | Latest  | Token authentication  |
| **bcryptjs**          | 2.x     | Password encryption   |
| **Express Validator** | 7.x     | Input validation      |
| **Helmet**            | 7.x     | Security headers      |
| **CORS**              | 2.x     | Cross-origin requests |
| **Dotenv**            | 16.x    | Environment variables |

### Infrastructure & Deployment

| Technology        | Provider | Purpose                 |
| ----------------- | -------- | ----------------------- |
| **GitHub**        | GitHub   | Version control & CI/CD |
| **MongoDB Atlas** | MongoDB  | Cloud database          |
| **Render**        | Render   | Backend hosting         |
| **Netlify**       | Netlify  | Frontend hosting        |
| **Git**           | Git      | VCS                     |

---

## 🏗️ System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  User Browser                           │
│              (Desktop/Mobile)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS Requests/Responses
                     ▼
┌─────────────────────────────────────────────────────────┐
│          Vue.js SPA Frontend (Netlify)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Components | Routes | Pinia Store | Services   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API (JSON)
                     ▼
┌─────────────────────────────────────────────────────────┐
│     Node.js + Express Backend (Render)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controllers | Middleware | Routes | Services   │  │
│  │  Authentication | Validation | Error Handling   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────────┐
│          MongoDB Atlas Database                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Users | Inventory | Procurement | Sales        │  │
│  │  Credit Transactions | Logs | Audit Trail       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
kgl-system/
│
├── 📦 backend/
│   ├── server.js                 # Express app entry point
│   ├── package.json              # Dependencies
│   │
│   ├── 📁 config/
│   │   ├── database.js           # MongoDB connection
│   │   └── env.js                # Environment config
│   │
│   ├── 📁 controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── inventoryController.js
│   │   ├── procurementController.js
│   │   ├── salesController.js
│   │   └── creditController.js
│   │
│   ├── 📁 middleware/            # Express middleware
│   │   ├── auth.js               # JWT verification
│   │   ├── validate.js           # Input validation
│   │   └── errorHandler.js       # Error handling
│   │
│   ├── 📁 models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Inventory.js
│   │   ├── Procurement.js
│   │   ├── Sales.js
│   │   └── Credit.js
│   │
│   ├── 📁 routes/                # API endpoints
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   ├── procurement.js
│   │   ├── sales.js
│   │   └── credit.js
│   │
│   └── 📁 utils/                 # Helper functions
│       ├── validators.js
│       ├── helpers.js
│       └── logger.js
│
├── 🎨 frontend/
│   ├── index.html
│   ├── vite.config.js            # Vite config
│   ├── netlify.toml              # Netlify config
│   ├── package.json
│   │
│   └── 📁 src/
│       ├── main.js               # Entry point
│       ├── App.vue               # Root component
│       │
│       ├── 📁 components/        # Reusable components
│       │   ├── Navbar.vue
│       │   ├── Sidebar.vue
│       │   ├── DataTable.vue
│       │   ├── Modal.vue
│       │   └── FormInput.vue
│       │
│       ├── 📁 views/             # Page components
│       │   ├── Dashboard.vue
│       │   ├── Login.vue
│       │   ├── Inventory.vue
│       │   ├── Procurement.vue
│       │   ├── Sales.vue
│       │   ├── Credit.vue
│       │   └── Analytics.vue
│       │
│       ├── 📁 router/            # Vue Router setup
│       │   └── index.js
│       │
│       ├── 📁 stores/            # Pinia stores
│       │   ├── auth.js
│       │   ├── inventory.js
│       │   └── ui.js
│       │
│       └── 📁 services/          # API services
│           ├── api.js            # Axios instance
│           ├── auth.js
│           ├── inventory.js
│           ├── procurement.js
│           ├── sales.js
│           └── credit.js
│
├── 📚 docs/
│   └── 📸 screenshots/           # UI screenshots
│       ├── login.png
│       ├── dashboard.png
│       ├── inventory.png
│       ├── sales.png
│       └── analytics.png
│
├── .gitignore
├── README.md                     # This file
├── LICENSE                       # MIT License
└── package.json                  # Root package.json
```

---

## 🗄️ Database Design

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,              // Full name
  email: String,             // Unique email
  password: String,          // Bcrypt hashed
  role: String,              // 'Manager', 'Agent', 'Director'
  branch: String,            // 'Maganjo' or 'Matugga'
  phone: String,             // Contact number
  isActive: Boolean,         // Account status
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Collection

```javascript
{
  _id: ObjectId,
  productName: String,       // e.g., "Maize"
  productType: String,       // e.g., "Cereal"
  category: String,          // Product category
  currentStock: Number,      // Units in stock
  minThreshold: Number,      // Low stock alert level
  price: Number,             // Unit price
  branch: String,            // Which branch
  lastRestocked: Date,       // Last procurement date
  totalValue: Number,        // Stock value calculation
  createdAt: Date,
  updatedAt: Date
}
```

### Procurement Collection

```javascript
{
  _id: ObjectId,
  productName: String,
  dealerName: String,        // Supplier name
  dealerPhone: String,       // Contact number
  dealerNIN: String,         // National ID
  quantity: Number,          // Units purchased
  pricePerUnit: Number,      // Cost price
  totalAmount: Number,       // quantity × pricePerUnit
  branch: String,
  deliveryDate: Date,
  notes: String,             // Additional info
  createdAt: Date,
  updatedAt: Date
}
```

### Sales Collection

```javascript
{
  _id: ObjectId,
  items: [{
    productName: String,
    quantity: Number,
    unitPrice: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  paymentMethod: String,     // 'cash', 'mobile_money', 'bank'
  paymentStatus: String,     // 'paid', 'pending'
  agentName: String,         // Who processed sale
  branch: String,
  customerName: String,      // Optional
  customerPhone: String,     // Optional
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Credit Sales Collection

```javascript
{
  _id: ObjectId,
  buyerName: String,
  buyerNIN: String,          // National ID
  buyerPhone: String,
  items: [{
    productName: String,
    quantity: Number,
    unitPrice: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  amountPaid: Number,        // Payments received
  outstandingBalance: Number, // totalAmount - amountPaid
  dueDate: Date,
  creditStatus: String,      // 'active', 'overdue', 'settled'
  creditHistory: [{
    date: Date,
    amount: Number,
    type: String             // 'charge', 'payment'
  }],
  branch: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚙️ System Requirements

### Development Environment

- **OS**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: 2GB free space for dependencies

### Required Software

| Software    | Version              | Download                                                |
| ----------- | -------------------- | ------------------------------------------------------- |
| **Node.js** | 18.x or higher       | [nodejs.org](https://nodejs.org/)                       |
| **npm**     | 8.x or higher        | Included with Node.js                                   |
| **Git**     | Latest               | [git-scm.com](https://git-scm.com/)                     |
| **MongoDB** | 6.x (or Atlas)       | [mongodb.com](https://www.mongodb.com/)                 |
| **VS Code** | Latest (Recommended) | [code.visualstudio.com](https://code.visualstudio.com/) |

### Recommended VS Code Extensions

```json
{
  "extensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "mongoDB.mongodb-vscode",
    "Vue.volar",
    "bradlc.vscode-tailwindcss",
    "wayou.vscode-todo-highlight"
  ]
}
```

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📥 Installation Guide

### Step 1: Clone Repository

```bash
git clone https://github.com/mazinahmed2010/KGL-SYSTEM.git
cd KGL-SYSTEM
```

### Step 2: Backend Setup

#### 2.1 Navigate to backend directory

```bash
cd backend
```

#### 2.2 Install dependencies

```bash
npm install
```

#### 2.3 Create .env file

```bash
# Linux/Mac
touch .env

# Windows
type nul > .env
```

#### 2.4 Configure environment (see [Environment Variables](#⚙️-environment-variables) section)

#### 2.5 Start development server

```bash
npm run dev
```

**Expected output:**

```
✓ Server running on http://localhost:3000
✓ Connected to MongoDB
✓ Listening for requests...
```

### Step 3: Frontend Setup

#### 3.1 Navigate to frontend directory

```bash
cd ../frontend
```

#### 3.2 Install dependencies

```bash
npm install
```

#### 3.3 Create .env file

```bash
# Linux/Mac
touch .env

# Windows
type nul > .env
```

#### 3.4 Configure environment (see section below)

#### 3.5 Start development server

```bash
npm run dev
```

**Expected output:**

```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 4: Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Test Login**:
  - Email: `admin@kgl.com` (if seeded)
  - Password: `password` (change immediately)

---

## ⚙️ Environment Variables

### Backend `.env` Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
APP_NAME=KGL-System

# Database Configuration (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/kgl_database

# OR (MongoDB Atlas Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kgl_database?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRATION=30d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload (Optional)
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=debug
```

### Frontend `.env` Configuration

Create a `.env` file in the `frontend/` directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=KGL-System
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_LOGGING=true
```

### Environment Variable Descriptions

| Variable       | Required | Example                     | Description                |
| -------------- | -------- | --------------------------- | -------------------------- |
| `PORT`         | Yes      | `3000`                      | Backend server port        |
| `NODE_ENV`     | Yes      | `development`               | Environment type           |
| `MONGODB_URI`  | Yes      | See above                   | Database connection string |
| `JWT_SECRET`   | Yes      | Random 32+ chars            | JWT signing key            |
| `VITE_API_URL` | Yes      | `http://localhost:3000/api` | API base URL               |

### Obtaining MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user (username/password)
4. Click "Connect" → "Drivers"
5. Copy connection string
6. Replace `<username>`, `<password>`, `<cluster>` with your values

---

## 🚀 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

All endpoints (except login/register) require JWT token in header:

```bash
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@kgl.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Manager",
    "email": "john@kgl.com",
    "role": "Manager",
    "branch": "Maganjo"
  }
}
```

#### Verify Token

```http
GET /api/auth/verify
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": {...}
}
```

---

### Inventory Endpoints

#### Get All Inventory

```http
GET /api/inventory?branch=Maganjo&limit=10&page=1
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "productName": "Maize",
      "productType": "Cereal",
      "currentStock": 1500,
      "price": 45000,
      "branch": "Maganjo",
      "totalValue": 67500000,
      "lastRestocked": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

#### Get Low Stock Items

```http
GET /api/inventory/low-stock?branch=Maganjo
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "lowStockItems": [
    {
      "productName": "Rice",
      "currentStock": 45,
      "minThreshold": 500,
      "shortage": 455
    }
  ]
}
```

#### Get Out of Stock

```http
GET /api/inventory/out-of-stock
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "outOfStock": ["Beans", "Sorghum"]
}
```

---

### Procurement Endpoints

#### Record Procurement

```http
POST /api/procurement
Authorization: Bearer <token>
Content-Type: application/json

{
  "productName": "Maize",
  "dealerName": "Farmer John",
  "dealerPhone": "+256789123456",
  "dealerNIN": "12345678901",
  "quantity": 2000,
  "pricePerUnit": 40000,
  "branch": "Maganjo",
  "deliveryDate": "2024-02-15T14:30:00Z"
}

Response: 201 Created
{
  "success": true,
  "procurement": {
    "_id": "507f1f77bcf86cd799439012",
    "totalAmount": 80000000,
    "createdAt": "2024-02-15T10:30:00Z"
  }
}
```

#### Get Procurement History

```http
GET /api/procurement?branch=Maganjo&startDate=2024-01-01&endDate=2024-02-01
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [...],
  "summary": {
    "totalProcured": 5000,
    "totalValue": 200000000
  }
}
```

---

### Sales Endpoints

#### Record Sale

```http
POST /api/sales
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productName": "Maize",
      "quantity": 50,
      "unitPrice": 45000
    }
  ],
  "paymentMethod": "cash",
  "branch": "Maganjo",
  "customerName": "ABC Supermarket",
  "customerPhone": "+256789654321"
}

Response: 201 Created
{
  "success": true,
  "sale": {
    "_id": "507f1f77bcf86cd799439013",
    "totalAmount": 2250000,
    "createdAt": "2024-02-15T10:30:00Z"
  }
}
```

#### Get Sales Summary

```http
GET /api/sales/summary?period=monthly&branch=Maganjo
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "summary": {
    "totalSales": 15000000,
    "transactionCount": 45,
    "avgTransactionValue": 333333,
    "paymentMethods": {
      "cash": 10000000,
      "mobile_money": 3000000,
      "bank": 2000000
    }
  }
}
```

---

### Credit Sales Endpoints

#### Create Credit Sale

```http
POST /api/credit
Authorization: Bearer <token>
Content-Type: application/json

{
  "buyerName": "Farmer Mukasa",
  "buyerNIN": "CM123456789012",
  "buyerPhone": "+256789123456",
  "items": [
    {
      "productName": "Beans",
      "quantity": 100,
      "unitPrice": 25000
    }
  ],
  "dueDate": "2024-03-15T23:59:59Z",
  "branch": "Matugga"
}

Response: 201 Created
{
  "success": true,
  "credit": {
    "_id": "507f1f77bcf86cd799439014",
    "totalAmount": 2500000,
    "creditStatus": "active",
    "createdAt": "2024-02-15T10:30:00Z"
  }
}
```

#### Record Credit Payment

```http
PATCH /api/credit/507f1f77bcf86cd799439014/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "amountPaid": 1000000,
  "paymentMethod": "mobile_money",
  "reference": "MTN12345"
}

Response: 200 OK
{
  "success": true,
  "credit": {
    "totalAmount": 2500000,
    "amountPaid": 1000000,
    "outstandingBalance": 1500000,
    "creditStatus": "active"
  }
}
```

---

## 🔒 Security Best Practices

### Authentication Security

- ✅ JWT tokens expire after 30 days
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Refresh tokens stored securely
- ✅ Rate limiting on login endpoint (5 attempts/15 min)
- ✅ HTTPS enforced in production

### Data Protection

- ✅ All sensitive data encrypted at rest
- ✅ API requests validated on backend
- ✅ SQL injection prevention via Mongoose ODM
- ✅ XSS protection via Vue.js sanitization
- ✅ CSRF tokens on state-changing requests

### API Security

- ✅ CORS configured for specific origins
- ✅ Helmet.js security headers enabled
- ✅ Input validation on all endpoints
- ✅ Request size limits enforced
- ✅ API rate limiting (100 requests/minute)

### Database Security

- ✅ MongoDB Atlas IP whitelist
- ✅ Database backups enabled
- ✅ User role-based permissions
- ✅ Audit logs for sensitive operations
- ✅ Connection strings use environment variables

### Deployment Security

- ✅ Environment variables never in code
- ✅ Secrets managed via .env files (gitignored)
- ✅ HTTPS/SSL certificates
- ✅ Regular dependency updates
- ✅ Security vulnerability scanning

### User Responsibility Checklist

- [ ] Change default admin password immediately
- [ ] Use strong, unique passwords (12+ chars)
- [ ] Enable 2FA if available
- [ ] Regularly update dependencies: `npm audit fix`
- [ ] Review access logs monthly
- [ ] Backup database weekly
- [ ] Keep Node.js and npm updated

---

## ⚡ npm Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run unit tests
npm run lint         # Check code style
npm run seed         # Seed database with sample data
```

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style
npm run type-check   # TypeScript checking
```

---

## ☁️ Deployment Guide

### Backend Deployment (Render)

#### 1. Prepare Repository

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

#### 2. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New+" → "Web Service"
3. Connect GitHub repository
4. Select `main` branch
5. Configure settings:
   - **Name**: kgl-system-api
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### 3. Add Environment Variables

1. Go to "Environment" section
2. Add all variables from `.env`:
   ```
   PORT=10000
   NODE_ENV=production
   MONGODB_URI=<your_atlas_uri>
   JWT_SECRET=<strong_random_key>
   ```
3. Click "Deploy Web Service"

#### 4. Verify Deployment

```bash
curl https://kgl-system-api.onrender.com/api/auth/health
# Should return 200 OK
```

---

### Frontend Deployment (Netlify)

#### 1. Build Application

```bash
cd frontend
npm run build
# Creates dist/ folder
```

#### 2. Deploy to Netlify

**Option A: Using Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**Option B: GitHub Integration**

1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repository
4. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Set `VITE_API_URL`
5. Click "Deploy"

#### 3. Configure Environment

1. Go to "Build & deploy" → "Environment"
2. Add:
   ```
   VITE_API_URL=https://kgl-system-api.onrender.com/api
   ```

#### 4. Verify Deployment

- Visit your Netlify domain
- Test login functionality
- Verify API connectivity

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### Backend Issues

**❌ Port Already in Use**

```bash
# Find process using port 3000
# Mac/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

**❌ MongoDB Connection Failed**

- Verify `MONGODB_URI` is correct
- Check MongoDB service is running: `mongod`
- For Atlas: Whitelist your IP address
- Test connection: `mongo <connection_string>`

**❌ JWT Errors**

```
Error: jwt malformed
Error: jwt expired
```

- Clear browser localStorage: `localStorage.clear()`
- Regenerate JWT_SECRET in .env
- Restart backend server

**❌ CORS Errors**

- Check `CORS_ORIGIN` in .env matches frontend URL
- Verify browser is on allowed origin
- Clear browser cache and cookies

#### Frontend Issues

**❌ Cannot Connect to API**

```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Verify VITE_API_URL in .env
cat .env | grep VITE_API_URL
```

**❌ Login Page Blank**

- Clear browser cache: Ctrl+Shift+Delete
- Check browser console for errors: F12
- Verify Node modules: `rm -rf node_modules && npm install`

**❌ Build Fails**

```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Follow these guidelines:

### 1. Fork & Clone

```bash
git clone https://github.com/your-username/KGL-SYSTEM.git
cd KGL-SYSTEM
```

### 2. Create Feature Branch

```bash
git checkout -b feature/amazing-feature
# OR
git checkout -b bugfix/issue-description
```

### 3. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test thoroughly

### 4. Commit & Push

```bash
git add .
git commit -m "feat: Add amazing feature"
# OR
git commit -m "fix: Resolve login issue"

git push origin feature/amazing-feature
```

### 5. Open Pull Request

- Go to GitHub repository
- Click "New Pull Request"
- Provide clear description
- Reference related issues
- Wait for review

### Commit Message Format

```
feat: Add new feature
fix: Resolve bug
docs: Update documentation
style: Code formatting
refactor: Restructure code
test: Add tests
chore: Dependencies update
```

---

## 📸 Screenshots

See the `docs/screenshots/` folder for UI previews:

- 📸 Login Page
- 📸 Dashboard
- 📸 Inventory Management
- 📸 Sales Terminal
- 📸 Executive Analytics

---

## 🚀 Future Enhancements

### Planned Features

- 📱 **Mobile App** (React Native)
- 💳 **Mobile Money Integration** (MTN, Airtel APIs)
- 📊 **Excel Export** for reports
- 📧 **Email Notifications** for low stock
- 📈 **Advanced Analytics Dashboard**
- 📦 **Barcode Scanning** for inventory
- 🌐 **Multi-language Support**
- 🔔 **SMS Alerts** (optional)

### Optimization Goals

- Performance optimization
- UI/UX improvements
- Mobile responsiveness
- Offline mode support
- Real-time sync

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

```
Copyright (c) 2024 Karibu Groceries Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Author

**Mazin Ahmed Ibrahim**

- 🎯 Full-Stack JavaScript Developer
- 📧 Email: mazin.ahmed.i.m@gmail.com
- 📱 Phone: +256 789 807 191
- 🌍 Location: Kiryandongo, Uganda

### Technical Skills

- **Frontend**: Vue.js 3, Vite, Tailwind CSS, Pinia
- **Backend**: Node.js, Express.js, MongoDB
- **DevOps**: Git, GitHub, Render, Netlify
- **Languages**: JavaScript, HTML5, CSS3

### Social Links

- [GitHub](https://github.com/mazinahmed2010)
- [LinkedIn](https:linkedin.com/in/mazin-ahmed-ibrahim-0b1959249)

---

## 🙏 Acknowledgments

- Karibu Groceries Ltd for the opportunity
- Open-source community
- All contributors and supporters

---

## 📞 Support

**Need help?**

- 📧 Email: mazin.ahmed.i.m@gmail.com
- 📱 Phone: +256 789 807 191
- 💬 Create an [Issue](https://github.com/mazinahmed2010/KGL-SYSTEM/issues)

---

<div align="center">

⭐ If you find this project helpful, please give it a star!

Last Updated: March 9, 2026

</div>
