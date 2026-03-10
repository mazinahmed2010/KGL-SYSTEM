const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration - allow all origins in development
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// MongoDB connection - Railway provides MONGO_URL automatically
const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/procurement', require('./routes/procurementRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/credit', require('./routes/creditRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// In production, serve frontend static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});