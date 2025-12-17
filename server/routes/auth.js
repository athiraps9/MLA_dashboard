const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }] 
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, role: user.role, fullName: user.fullName, district: user.district } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public Signup
router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    let user = await User.findOne({ username: email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
      username: email, // Using email as username for public users
      email,
      password,
      role: 'public',
      fullName
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: user._id, role: user.role, fullName: user.fullName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed Initial Data (Run once or use for testing)
router.post('/seed', async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = new User({
      username: 'admin',
      password: 'adminpassword',
      role: 'admin',
      fullName: 'System Administrator'
    });
    await admin.save();

    const mla = new User({
      username: 'mla_kerala',
      password: 'mlapassword',
      role: 'mla',
      district: 'Thiruvananthapuram',
      fullName: 'Shri. P. Kumar'
    });
    await mla.save();

    res.json({ message: 'Users seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
