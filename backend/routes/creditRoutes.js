const express = require('express');
const router = express.Router();

// Mock credits
let credits = [];

// Create credit sale
router.post('/', (req, res) => {
  const newCredit = {
    id: credits.length + 1,
    ...req.body,
    dateOfDispatch: new Date(),
    createdAt: new Date(),
    status: 'pending'
  };
  credits.push(newCredit);
  res.status(201).json(newCredit);
});

// Get all credits
router.get('/', (req, res) => {
  res.json(credits);
});

// Get credits by branch
router.get('/branch/:branch', (req, res) => {
  const branchCredits = credits.filter(c => c.branch === req.params.branch);
  res.json(branchCredits);
});

// Get credit summary
router.get('/summary', (req, res) => {
  const totalDue = credits.reduce((sum, credit) => sum + (credit.amountDue || 0), 0);
  const totalPaid = credits.reduce((sum, credit) => sum + (credit.amountPaid || 0), 0);
  const overdue = credits.filter(c => new Date(c.dueDate) < new Date() && c.status !== 'paid').length;
  
  res.json({ 
    totalOutstanding: totalDue - totalPaid,
    totalDue,
    totalPaid,
    count: credits.length,
    overdue
  });
});

// Get overdue payments
router.get('/overdue', (req, res) => {
  const overdue = credits.filter(c => new Date(c.dueDate) < new Date() && c.status !== 'paid');
  res.json(overdue);
});

// Update payment status
router.patch('/:id/payment', (req, res) => {
  const credit = credits.find(c => c.id === parseInt(req.params.id));
  if (!credit) {
    return res.status(404).json({ message: 'Credit sale not found' });
  }
  
  credit.amountPaid = (credit.amountPaid || 0) + (req.body.amountPaid || 0);
  
  if (credit.amountPaid >= credit.amountDue) {
    credit.status = 'paid';
  } else if (credit.amountPaid > 0) {
    credit.status = 'partially paid';
  }
  
  res.json(credit);
});

// Get single credit sale
router.get('/:id', (req, res) => {
  const credit = credits.find(c => c.id === parseInt(req.params.id));
  if (!credit) {
    return res.status(404).json({ message: 'Credit sale not found' });
  }
  res.json(credit);
});

module.exports = router;