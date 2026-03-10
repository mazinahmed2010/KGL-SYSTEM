# 🌾 KGL Enterprise System

**Karibu Groceries Ltd – Enterprise Inventory & Sales Management System**

A full-stack web application built with **Vue.js, Node.js, Express, and MongoDB** to digitize the operations of Karibu Groceries Ltd, a wholesale distributor dealing in cereals.

---

# 📖 Overview

Karibu Groceries Ltd previously recorded business operations in **manual black books**, which caused:

- Data loss
- Slow reporting
- Calculation errors
- Lack of stock visibility

The **KGL Enterprise System** solves these problems by providing a **digital platform for procurement, inventory, and sales management**.

---

# 🏢 Business Context

KGL operates **two branches**:

- Maganjo Branch
- Matugga Branch

The system allows managers and agents to:

✔ Track inventory in real time
✔ Record procurement transactions
✔ Manage produce sales
✔ Monitor stock levels
✔ Generate executive reports

---

# ✨ Features

## 🔐 Authentication

- Secure login with **JWT authentication**
- Password hashing using **bcrypt**
- Role-based access control

User roles:

- Manager
- Agent
- Director

---

## 📦 Procurement Management

Managers can record produce purchases.

Features:

- Dealer information validation
- Automatic inventory updates
- Branch tracking
- Procurement history

---

## 💰 Sales Management

Agents can record sales quickly.

Features:

- Real-time stock checking
- Multiple payment methods
- Automatic inventory deduction

Payment methods:

- Cash
- Mobile Money
- Bank Transfer

---

## 📊 Inventory Management

Managers can monitor stock levels in real time.

Features:

- Inventory listing
- Low-stock alerts
- Out-of-stock alerts
- Stock valuation

---

## 👑 Executive Dashboard

Directors can view:

- Total sales
- Stock health
- Branch performance
- Key business metrics

---

# 🛠️ Technology Stack

## Frontend

- Vue.js 3
- Vue Router
- Pinia
- Axios
- Vite
- Vue Toastification
- Font Awesome

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Express Validator
- Helmet
- CORS

---

# 📁 Project Structure

```
kgl-enterprise-system
│
├── backend
│   ├── server.js
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   └── routes
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
└── README.md
```

---

# ⚡ Quick Start

Clone the repository:

```
git clone https://github.com/yourusername/kgl-enterprise-system.git
```

Navigate to project:

```
cd kgl-enterprise-system
```

---

npm install
npm run dev

Backend runs on:

```

http://localhost:3000

```

-

```

Frontend runs on

http://localhost:5173

```

---

# ⚙️ Environment Variables

## Backend `.env`

```

PORT=3000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRE=30d

```

---

## Frontend `.env`

```

## VITE_API_URL=http://localhost:3000/api

# ☁️ Deployment

## Backend Deployment

Backend API is deployed on **Railway**.

Production API URL:

```

https://kgl-enterprise-production.up.railway.app/api

```

---

## Frontend Deployment

Frontend is deployed on **Netlify**.

Live Website:

```

https://kgl-enterprise.netlify.app

```

---

# 🔍 Test API

Example request:

```

GET https://kgl-enterprise-production.up.railway.app/api

```

Expected response:

```

{
"status": "KGL API Running"
}

```

---

# 📊 System Architecture

```

Users
│
▼
Frontend (Netlify)
│
▼
Backend API (Railway)
│
▼
MongoDB Atlas Database

```

---

# 🚀 Future Improvements

- Mobile application
- Mobile Money API integration
- Export reports to Excel/PDF
- SMS notifications for low stock
- Barcode & QR inventory tracking

---

# 🤝 Contributing

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

5. Create Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Developer

**Mazin Ahmed Ibrahim**

Full-Stack JavaScript Developer

Technologies:

- Node.js
- Vue.js
- MongoDB
- Express.js

Location: Kampala, Uganda

---

# 🏁 Conclusion

The **KGL Enterprise System** transforms Karibu Groceries Ltd from a **manual paper-based workflow** into a **modern digital inventory and sales management platform**.

The system enables:

- Real-time inventory tracking
- Automated procurement records
- Secure authentication
- Multi-branch business management
- Executive insights for decision making
```
