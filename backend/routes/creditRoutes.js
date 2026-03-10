const express = require('express');
const router = express.Router();

// Mock credits
let credits = [];

// Create credit sale
router.post('/', (req, res) => {
  const newCredit = {
    id: credits.length + 1,
    ...req.body,
    date: new Date()
  };
  credits.push(newCredit);
  res.status(201).json(newCredit);
});

// Get all credits
router.get('/', (req, res) => {
  res.json(credits);
});

// Get credit summary
router.get('/summary', (req, res) => {
  const total = credits.reduce((sum, credit) => sum + (credit.amountDue || 0), 0);
  res.json({ totalOutstanding: total, count: credits.length });
});

module.exports = router;