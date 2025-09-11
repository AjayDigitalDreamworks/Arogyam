require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Counselor = require("./models/counsellor");
const Appointment = require("./models/appointment");
const url = process.env.MONGO_URL;
const session = require("express-session");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
// const Hub = require("./models/Hub")

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const express = require("express");
const app = express();

const sessionOption = {
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: false, // Changed for Express 5.x compatibility
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days - removed conflicting expires
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax' // Added for CORS compatibility
  },
};

// Updated CORS configuration for credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080", // Vite default port
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set currUser - this should work now
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  console.log('Current user in session:', req.user); // Better logging
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/counselors", async (req, res) => {
  try {
    let counsellors = await Counselor.find({});
    res.json(counsellors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching counsellors", error: error.message });
  }
});

// resources hub
const videoRoutes = require('./routes/videoRoutes');
app.use('/hub', videoRoutes);


app.post("/appointments", async (req, res) => {
  try {
    console.log(req.body);
    const appointmentData = req.body;
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    const {
      username,
      fullName,
      email,
      phone,
      password,
      avatar,
      university,
      yearOfStudy,
    } = req.body;

    const user = new User({
      username,
      fullName,
      email,
      phone,
      avatar,
      university,
      yearOfStudy,
    });

    const registeredUser = await User.register(user, password);

    // Log the user in after successful registration
    req.login(registeredUser, (err) => {
      if (err) {
        console.error('Login after signup error:', err);
        return res.status(500).send("Error logging in after registration: " + err.message);
      }
      console.log('User registered and logged in:', req.user);
      res.redirect("http://localhost:8080/");
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).send("Error registering user: " + error.message);
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).send("Authentication error: " + err.message);
    }
    if (!user) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).send("Invalid credentials");
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).send("Login error: " + err.message);
      }

      console.log('Login successful, user:', req.user);
      res.redirect("http://localhost:8080/");
    });
  })(req, res, next);
});

// Add logout route
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: "Logout error", error: err.message });
    }
    console.log('User logged out');
    res.json({ message: "Logout successful" });
  });
});

// Add a route to check current user status
app.get("/auth/status", (req, res) => {
  console.log('Auth status check - current user:', req.user);
  if (req.user) {
    res.json({ 
      authenticated: true, 
      user: req.user,
      currUser: req.user 
    });
  } else {
    res.json({ 
      authenticated: false, 
      user: null,
      currUser: null 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`);
});
