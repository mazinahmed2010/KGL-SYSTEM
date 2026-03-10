const express = require('express');
const router = express.Router();

// Mock sales
let sales = [];

// Create sale
router.post('/', (req, res) => {
  const newSale = {
    id: sales.length + 1,
    ...req.body,
    date: new Date()
  };
  sales.push(newSale);
  res.status(201).json(newSale);
});

// Get all sales
router.get('/', (req, res) => {
  res.json(sales);
});

// Get sales summary
router.get('/summary', (req, res) => {
  const total = sales.reduce((sum, sale) => sum + (sale.amountPaid || 0), 0);
  res.json({ totalRevenue: total, count: sales.length });
});

module.exports = router;