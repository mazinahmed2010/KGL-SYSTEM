const express = require('express');
const router = express.Router();

// Mock procurements
let procurements = [];

// Create procurement
router.post('/', (req, res) => {
  const newProcurement = {
    id: procurements.length + 1,
    ...req.body,
    date: new Date()
  };
  procurements.push(newProcurement);
  res.status(201).json(newProcurement);
});

// Get all procurements
router.get('/', (req, res) => {
  res.json(procurements);
});

module.exports = router;