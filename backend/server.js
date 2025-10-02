require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Counselor = require("./models/counsellor");
const Appointment = require("./models/appointment");
const ChatMessage = require("./models/chat");
const jwt = require("jsonwebtoken");
const { verifyToken } = require('./middleware/authMiddleware');
const addVolunteer = require('./controllers/addVolunteer');
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:8080",
  "https://sih-2025-arogyam.onrender.com",
];

// ✅ Socket.IO setup with CORS configuration
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS (Socket.IO)"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// ✅ MongoDB connection
const url = process.env.MONGO_URL;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// ✅ Session configuration
const sessionOption = {
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure this is true in production (HTTPS)
    sameSite: 'None',  // Important for cross-origin cookies
  },
};

// ✅ CORS and Body Parser
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Initialize session and Passport.js
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Passport authentication setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Static files and view engine
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


// ✅ Logging current session user
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  console.log('Current user in session:', req.user);
  next();
});

// ✅ Default route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Current user route (for session authentication)
app.get("/current_user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// ✅ Route to get counselors
app.get("/counselors", async (req, res) => {
  try {
    let counselors = await Counselor.find({});
    res.json(counselors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching counselors", error: error.message });
  }
});


app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// ✅ Signup route
app.post("/signup", async (req, res) => {
  try {
    const { username, fullName, email, phone, password, avatar, university, yearOfStudy } = req.body;
    const user = new User({ username, fullName, email, phone, avatar, university, yearOfStudy });

    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        console.error('Login after signup error:', err);
        return res.status(500).send("Error logging in after registration: " + err.message);
      }
      console.log('User registered and logged in:', req.user);
      res.redirect("http://localhost:8080/dashboard"); // Redirect to dashboard
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).send("Error registering user: " + error.message);
  }
});

// ✅ Login route
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({ message: "Authentication error", error: err.message });
    }
    if (!user) {
      console.log("Login failed: Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login error", error: err.message });
      }

      console.log("Login successful, user:", req.user);
      res.redirect("http://localhost:8080/dashboard"); // Redirect to dashboard
    });
  })(req, res, next);
});

// ✅ Logout route
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

// ✅ Appointment route
app.post("/appointments", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
});

// ✅ Socket.IO: Handle real-time messaging
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', ({ token, communityId }) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.join(communityId);
      console.log(`User ${payload.aliasName} joined community ${communityId}`);

      socket.on('send-message', async (message) => {
        await ChatMessage.create({
          communityId,
          senderProfileId: payload.uniqueId,
          message,
        });

        io.to(communityId).emit('new-message', {
          aliasName: payload.aliasName,
          avatarUrl: payload.avatarUrl,
          message,
          timestamp: new Date(),
        });
      });
    } catch (err) {
      console.error('Socket authentication error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// ✅ Define API routes
const communityRoutes = require('./routes/community');
app.use('/api/community', communityRoutes);
const volunteerRoutes = require('./routes/volunteer');
app.use('/login/volunteer', volunteerRoutes);

// ✅ Server port setup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
