const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Counselor = require('../models/counsellor');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Render counsellor signup form (GET)
router.get('/signup', (req, res) => {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';
  res.render('counsellorSignup', { msg: '', frontendOrigin });
});

// Signup: accepts all fields in the counselor schema
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, name, specialty, rating, experience, image } = req.body;

    if (!username || !email || !password || !name || !specialty || !experience) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // check for existing username/email
    const existing = await Counselor.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(409).json({ message: 'Username or email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const counselor = new Counselor({
      username,
      email,
      password: hashed,
      name,
      specialty,
      rating: rating || 0,
      experience,
      image: image || '👩‍⚕️',
      isApproved: false
    });

    await counselor.save();

    // If request comes from a browser form, redirect to the login form page
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect('/api/counsellor/login');
    }

    res.status(201).json({ message: 'Counsellor account created', id: counselor._id });
  } catch (err) {
    console.error('Counsellor signup error', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Render counsellor login form (GET)
router.get('/login', (req, res) => {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';
  res.render('counsellorLogin', { msg: '', frontendOrigin });
});

// Login: accepts username and password
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

    const counselor = await Counselor.findOne({ username });
    if (!counselor) return res.status(404).json({ message: 'Counsellor not found' });

    const isMatch = await bcrypt.compare(password, counselor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate token
    const payload = { userId: counselor._id, role: counselor.role, username: counselor.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, user: { _id: counselor._id, username: counselor.username, name: counselor.name } });
  } catch (err) {
    console.error('Counsellor login error', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Logout for counsellors
router.post('/logout', (req, res) => {
  try {
    // If cookies were used to store tokens, clear them
    res.clearCookie && res.clearCookie('token');
    res.json({ message: 'Counsellor logged out' });
  } catch (err) {
    console.error('Counsellor logout error', err);
    res.status(500).json({ message: 'Logout failed' });
  }
});

router.get('/student/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    // console.log('Fetching student with ID:', studentId);
    const Student = require('../models/user');
    const student = await Student.findById(studentId).select('-password');
    // console.log('Fetched student:', student);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('Get student error', err);
    res.status(500).json({ message: 'Failed to fetch student', error: err.message });
  }
});

module.exports = router;