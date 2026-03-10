const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Mock users for demo (in production, use database)
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

// Login endpoint
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user (in production, query database)
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      ...userWithoutPassword,
      token
    });
  }
);

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production'
    );
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;