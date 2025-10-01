require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Models and controllers
const User = require("./models/user");
const Counselor = require("./models/counsellor");
const Appointment = require("./models/appointment");
const ChatMessage = require("./models/chat");
const { verifyToken } = require('./middleware/authMiddleware');
const addVolunteer = require('./controllers/addVolunteer');

// Initialize app
const app = express();
const server = http.createServer(app);

// ✅ Allowed frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://sih-2025-arogyam.onrender.com",
  process.env.LOCAL_URL || "http://localhost:8080"
];

// ✅ Apply CORS to Express
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Apply CORS to Socket.IO
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
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

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("MongoDB error:", err));

// ✅ Session config
const sessionOption = {
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  },
};

// ✅ Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Static & view setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Logging current session user
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  console.log('Current user in session:', req.user);
  next();
});

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/current_user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/counselors", async (req, res) => {
  try {
    const counselors = await Counselor.find({});
    res.json(counselors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching counselors", error: err.message });
  }
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, fullName, email, phone, password, avatar, university, yearOfStudy } = req.body;

    const user = new User({ username, fullName, email, phone, avatar, university, yearOfStudy });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return res.status(500).send("Error logging in after registration: " + err.message);
      res.redirect(process.env.FRONTEND_URL + "/dashboard");
    });
  } catch (err) {
    res.status(400).send("Error registering user: " + err.message);
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return res.status(500).json({ message: "Authentication error", error: err.message });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login error", error: err.message });
      res.redirect(process.env.FRONTEND_URL + "/dashboard");
    });
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout error", error: err.message });
    res.json({ message: "Logout successful" });
  });
});

app.post("/appointments", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
});

// ✅ Other Routes
app.use('/api/mood', require('./routes/moodRoutes'));
app.use('/api/sleep', require('./routes/sleepRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/videos', require('./routes/videoRoutes'));
app.use('/hub', require('./routes/videoRoutes'));
app.use('/login/volunteer', require('./routes/volunteer'));
app.use('/api/community', require('./routes/community'));
app.post('/addvolunteer', verifyToken, addVolunteer);

app.get("/auth/status", (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user || null,
    currUser: req.user || null
  });
});

// ✅ SOCKET.IO Chat Handling
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

// ✅ Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
