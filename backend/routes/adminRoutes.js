const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const payload = { userId: admin._id, role: admin.role, username: admin.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { _id: admin._id, username: admin.username, name: admin.name } });
  } catch (err) {
    console.error('Admin login error', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({ username, password: hashedPassword, name });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Admin registration error', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});


module.exports = router;