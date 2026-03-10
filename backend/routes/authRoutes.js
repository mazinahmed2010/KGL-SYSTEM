const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock users for demo
const users = [
  {
    id: 1,
    email: 'manager@kgl.com',
    password: 'manager123',
    role: 'Manager',
    branch: 'Maganjo',
    name: 'John Manager'
  },
  {
    id: 2,
    email: 'agent@kgl.com',
    password: 'agent123',
    role: 'Agent',
    branch: 'Matugga',
    name: 'Jane Agent'
  },
  {
    id: 3,
    email: 'director@kgl.com',
    password: 'director123',
    role: 'Director',
    branch: 'All',
    name: 'Mr. Orban'
  }
];

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production',
    { expiresIn: '30d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  
  res.json({ ...userWithoutPassword, token });
});

// Verify token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;