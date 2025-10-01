const express = require('express');

const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Volunteer = require("../models/volunteer");
const generateUserIdentity = require("../utils/identity"); 

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  const volunteer = await Volunteer.findOne({ email });

  if (volunteer) {
    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const identity = generateUserIdentity();

    const token = jwt.sign(
      {
        userId: volunteer._id,
        role: 'volunteer',
        aliasName: identity.aliasName,
        avatarUrl: identity.avatarUrl,
        uniqueId: identity.uniqueId,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      identity: {
        aliasName: identity.aliasName,
        avatarUrl: identity.avatarUrl,
        uniqueId: identity.uniqueId,
      },
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).send("Authentication error: " + err.message);
    }
    if (!user) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).send("Invalid credentials");
    }

    if (user.role !== 'student' && user.role !== 'counceller') {
      return res.status(403).send("Unauthorized role");
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).send("Login error: " + err.message);
      }

      console.log('Login successful, user:', req.user);
      return res.redirect("https://sih-2025-arogyam.onrender.com/");
    });
  })(req, res, next);
});


module.exports = router;