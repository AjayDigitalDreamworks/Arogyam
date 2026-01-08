const express = require('express');
const router = express.Router();
const User = require('../models/user');
const cors = require("cors");

// Handle OPTIONS preflight request for CORS
router.options('/', cors());

// GET /api/sleep/:userId - get sleep history
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('sleepHistory');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.sleepHistory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// POST /api/mood - Add a mood entry to the current user
router.post('/', async (req, res) => {
  try {
    // You should have authentication middleware to get the current user
    // For demo, assume userId is sent in body (replace with req.user._id if using auth)
    const { userId, hours, quality } = req.body;
    if (!userId || !hours || !quality) {
      return res.status(400).json({ message: 'sleep hours are required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.sleepHistory.push({ hours, quality});
    await user.save();
    res.status(200).json({ message: 'Sleep entry added', sleepHistory: user.sleepHistory });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
