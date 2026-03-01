// const express = require('express');

// const router = express.Router();
// const passport = require("passport");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Volunteer = require("../models/volunteer");
// const generateUserIdentity = require("../utils/identity"); 

// const { verifyToken } = require("../middleware/authMiddleware");
// router.post("/", verifyToken, async (req, res, next) => {
//   const { email, password } = req.body;

//   const volunteer = await Volunteer.findOne({ email });

//   if (volunteer) {
//     const isMatch = await bcrypt.compare(password, volunteer.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const identity = generateUserIdentity();

//     const token = jwt.sign(
//       {
//         userId: volunteer._id,
//         role: 'volunteer',
//         aliasName: identity.aliasName,
//         avatarUrl: identity.avatarUrl,
//         uniqueId: identity.uniqueId,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     return res.status(200).json({
//       token,
//       identity: {
//         aliasName: identity.aliasName,
//         avatarUrl: identity.avatarUrl,
//         uniqueId: identity.uniqueId,
//       },
//     });
//   }

//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       console.error('Authentication error:', err);
//       return res.status(500).send("Authentication error: " + err.message);
//     }
//     if (!user) {
//       console.log('Login failed: Invalid credentials');
//       return res.status(401).send("Invalid credentials");
//     }

//     if (user.role !== 'student' && user.role !== 'counceller') {
//       return res.status(403).send("Unauthorized role");
//     }

//     req.login(user, (err) => {
//       if (err) {
//         console.error('Login error:', err);
//         return res.status(500).send("Login error: " + err.message);
//       }

//       console.log('Login successful, user:', req.user);
//       return res.redirect("https://sih-2025-arogyam.onrender.com/");
//     });
//   })(req, res, next);
// });


// module.exports = router;

// routes/volunteerRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");


// routes/volunteerRoutes.js
router.post("/create", async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      password,
      phone,
      university,
      yearOfStudy,
      avatar,
    } = req.body;

    // basic validation
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // check duplicate
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    const volunteer = new User({
      fullName,
      email,
      username,
      password,
      phone,
      university,
      yearOfStudy,
      avatar,
      role: "volunteer",
    });

    await volunteer.save();

    res.status(201).json({
      message: "Volunteer created successfully",
      volunteer,
    });
  } catch (error) {
    console.error("CREATE VOLUNTEER ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


//  Get all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" })
      .select("fullName email role");
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("fullName email role");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Set as volunteer
router.patch("/:id/set-volunteer", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "volunteer" },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Remove volunteer
router.patch("/:id/remove-volunteer", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "student" },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
