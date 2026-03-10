const express = require('express');
const router = express.Router();

// Mock inventory data
let inventory = [
  { id: 1, name: 'Beans', type: 'Beans', tonnage: 5000, price: 3000 },
  { id: 2, name: 'Maize', type: 'Grain Maize', tonnage: 8000, price: 2500 },
  { id: 3, name: 'Cow peas', type: 'Cow peas', tonnage: 3000, price: 3500 },
  { id: 4, name: 'G-nuts', type: 'G-nuts', tonnage: 2000, price: 5000 },
  { id: 5, name: 'Soybeans', type: 'Soybeans', tonnage: 4000, price: 2800 }
];

// Get all inventory
router.get('/', (req, res) => {
  res.json(inventory);
});

// Get inventory by branch
router.get('/branch/:branch', (req, res) => {
  // In a real app, filter by branch
  res.json(inventory);
});

// Get low stock items
router.get('/low-stock', (req, res) => {
  const lowStock = inventory.filter(item => item.tonnage < 1000 && item.tonnage > 0);
  res.json(lowStock);
});

// Get out of stock items
router.get('/out-of-stock', (req, res) => {
  const outOfStock = inventory.filter(item => item.tonnage === 0);
  res.json(outOfStock);
});

// Get single item
router.get('/:id', (req, res) => {
  const item = inventory.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

module.exports = router;