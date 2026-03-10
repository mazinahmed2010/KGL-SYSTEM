const express = require('express');
const router = express.Router();

// Mock procurements
let procurements = [];

// Create procurement
router.post('/', (req, res) => {
  const newProcurement = {
    id: procurements.length + 1,
    ...req.body,
    date: new Date(),
    createdAt: new Date()
  };
  procurements.push(newProcurement);
  res.status(201).json(newProcurement);
});

// Get all procurements
router.get('/', (req, res) => {
  res.json(procurements);
});

// Get procurements by branch
router.get('/branch/:branch', (req, res) => {
  const branchProcurements = procurements.filter(p => p.branch === req.params.branch);
  res.json(branchProcurements);
});

// Get single procurement
router.get('/:id', (req, res) => {
  const procurement = procurements.find(p => p.id === parseInt(req.params.id));
  if (!procurement) {
    return res.status(404).json({ message: 'Procurement not found' });
  }
  res.json(procurement);
});

module.exports = router;