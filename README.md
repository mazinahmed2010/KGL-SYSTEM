# 🌾 KGL-System

Karibu Groceries Ltd – Enterprise Inventory & Sales Management System

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

# 📖 Overview

The KGL-System is a full-stack inventory and sales management system, developed for Karibu Groceries Ltd, a wholesale distributor dealing in cereals and produce.

The company previously recorded all operations in\*manual black books, which caused:

- Data loss
- Calculation errors
- Slow reporting
- Lack of stock visibility across branches

This system digitizes the entire workflow, allowing managers and agents to manage inventory, procurement, and sales efficiently.

---

# 🏢 Business Context

Karibu Groceries Ltd operates two branches:

- Maganjo Branch
- \*Matugga Branch

The system enables:

✔ Real-time stock tracking
✔ Procurement recording
✔ Sales management
✔ Credit tracking for trusted buyers
✔ Executive reporting for directors

---

# ✨ Key Features

## 🔐 Authentication & Authorization

- Secure login using **JWT authentication**
- Password hashing using **bcrypt**
- Role-based access control
- Session persistence

User Roles:

- Manager
- Agent
- Director

---

## 📦 Procurement Management

Managers can record new produce purchases.

Features:

- Dealer information validation
- Minimum procurement quantity validation
- Automatic inventory updates
- Branch-specific procurement tracking

---

## 💰 Sales Terminal

Agents and managers can record sales quickly.

Features:

- Real-time stock checking
- Quick quantity presets
- Multiple payment methods

Payment methods supported:

- Cash
- Mobile Money
- Bank Transfer

---

## 💳 Credit Sales System

Trusted buyers can purchase on credit.

Features:

- National ID (NIN) validation
- Due date tracking
- Credit balance monitoring
- Overdue payment alerts

---

## 📊 Inventory Management

Managers can monitor stock levels in real time.

Features:

- Inventory list
- Low stock alerts
- Out of stock alerts
- Product categorization
- Stock value calculation

---

## 👑 Executive Dashboard

Directors can view **aggregated business data** without seeing individual transactions.

Dashboard includes:

- Total sales revenue
- Stock health metrics
- Branch performance
- Key performance indicators

---

# 🛠️ Technology Stack

## Frontend

| Technology         | Purpose                            |
| ------------------ | ---------------------------------- |
| Vue 3              | Modern reactive frontend framework |
| Vue Router         | Navigation & route guards          |
| Pinia              | State management                   |
| Axios              | API communication                  |
| Vite               | Build tool                         |
| Font Awesome       | Icons                              |
| Vue Toastification | Notifications                      |

---

## Backend

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| Node.js           | JavaScript runtime         |
| Express.js        | REST API framework         |
| MongoDB           | NoSQL database             |
| Mongoose          | MongoDB ODM                |
| JWT               | Authentication             |
| bcryptjs          | Password encryption        |
| Express Validator | Input validation           |
| Helmet            | Security middleware        |
| CORS              | Cross origin configuration |

---

## DevOps & Hosting

| Technology    | Purpose             |
| ------------- | ------------------- |
| Git           | Version control     |
| GitHub        | Source code hosting |
| Render        | Backend deployment  |
| Netlify       | Frontend deployment |
| MongoDB Atlas | Cloud database      |

---

# 🏗️ System Architecture

```
User Browser
     │
     ▼
Vue.js Frontend (Netlify)
     │
     │ API Requests
     ▼
Node.js + Express Backend (Render)
     │
     ▼
MongoDB Atlas Database
```

---

# 📁 Project Structure

```
kgl-enterprise-system
│
├── backend
│   ├── server.js
│   ├── config
│   │   └── database.js
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── utils
│
├── frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── netlify.toml
│   └── src
│       ├── components
│       ├── views
│       ├── router
│       ├── stores
│       └── services
│
├── docs
│   └── screenshots
│
└── README.md
```

---

# 🗄️ Database Design

## Users Collection

```
{
 name,
 email,
 password,
 role,
 branch
}
```

---

## Inventory Collection

```
{
 produceName,
 produceType,
 tonnage,
 price,
 branch,
 updatedAt
}
```

---

## Procurement Collection

```
{
 produceName,
 dealerName,
 dealerContact,
 tonnage,
 price,
 branch,
 date
}
```

---

## Sales Collection

```
{
 produce,
 quantity,
 price,
 paymentMethod,
 branch,
 createdAt
}
```

---

## Credit Sales Collection

```
{
 buyerName,
 nin,
 produce,
 quantity,
 amount,
 dueDate,
 status
}
```

---

# ⚡ Quick Start

Clone and run the project quickly.

```bash
git clone https://github.com/yourusername/kgl-enterprise-system.git

cd kgl-enterprise-system
```

---

## Backend Setup

```
cd backend
npm install
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

Application runs on:

```
http://localhost:5173
```

---

# ⚙️ Environment Variables

## Backend `.env`

```
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/kgl_database

JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

---

## Frontend `.env`

```
VITE_API_URL=http://localhost:3000/api
```

---

# ☁️ Deployment

## Backend Deployment (Render)

1. Push repository to GitHub
2. Create new **Web Service**
3. Select backend folder
4. Add environment variables
5. Deploy

---

## Frontend Deployment (Netlify)

1. Run build

```
npm run build
```

2. Upload the **dist folder** to Netlify.

---

# 📚 API Endpoints

Authentication

```
POST /api/auth/login
GET  /api/auth/verify
```

---

Inventory

```
GET /api/inventory
GET /api/inventory/low-stock
GET /api/inventory/out-of-stock
```

---

Procurement

```
POST /api/procurement
GET /api/procurement
```

---

Sales

```
POST /api/sales
GET /api/sales
GET /api/sales/summary
```

---

Credit Sales

```
POST /api/credit
GET /api/credit
PATCH /api/credit/:id/payment
```

---

# 📸 Screenshots

Add real screenshots in this folder:

```
docs/screenshots
```

Example:

```
docs/screenshots/login.png
docs/screenshots/dashboard.png
docs/screenshots/sales.png
docs/screenshots/inventory.png
```

---

# 🚀 Future Improvements

- Mobile application
- Mobile Money API integration
- Export reports to Excel
- SMS notifications for low stock
- Real-time analytics dashboard
- Barcode scanning for inventory

---

🤝 Contributing

1. Fork the repository
2. Create a feature branch

```
git checkout -b feature/new-feature
```

3. Commit changes

```
git commit -m "Add new feature"
```

4. Push changes

```
git push origin feature/new-feature
```

5. Open Pull Request

---

📄 License

This project is licensed under the **MIT License**.

---

👨‍💻 Developer

Mazin Ahmed Ibrahim

Full-Stack JavaScript Developer

Email: mazin.ahmed.i.m@gmail.com

phone: +256789807191

Technologies:

- Node.js
- Vue.js
- MongoDB
- Express.js

Location: Kiryandongo, Uganda.
#   K G L - S Y S T E M  
 