const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Signup
router.post(
  '/signup',
  [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, firstname, lastname, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already taken' });
      }

      // Hash password and save user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, firstname, lastname, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ message: 'Login successful', username });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
