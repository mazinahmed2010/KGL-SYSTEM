const express = require('express');
const router = express.Router();

// Mock sales
let sales = [];

// Create sale
router.post('/', (req, res) => {
  const newSale = {
    id: sales.length + 1,
    ...req.body,
    date: new Date(),
    createdAt: new Date()
  };
  sales.push(newSale);
  res.status(201).json(newSale);
});

// Get all sales
router.get('/', (req, res) => {
  res.json(sales);
});

// Get sales by branch
router.get('/branch/:branch', (req, res) => {
  const branchSales = sales.filter(s => s.branch === req.params.branch);
  res.json(branchSales);
});

// Get sales summary
router.get('/summary', (req, res) => {
  const total = sales.reduce((sum, sale) => sum + (sale.amountPaid || 0), 0);
  const totalKg = sales.reduce((sum, sale) => sum + (sale.tonnage || 0), 0);
  res.json({ 
    totalRevenue: total, 
    totalQuantity: totalKg,
    count: sales.length,
    averageSale: sales.length > 0 ? total / sales.length : 0
  });
});

// Get single sale
router.get('/:id', (req, res) => {
  const sale = sales.find(s => s.id === parseInt(req.params.id));
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' });
  }
  res.json(sale);
});

module.exports = router;