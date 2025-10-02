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
  process.env.FRONTEND_URL || "https://sih-2025-arogyam.onrender.com",
  process.env.LOCAL_URL || "http://localhost:8080",
  "https://sih-2025-arogyam-0cf2.onrender.com",
  "http://localhost:3000"
];

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

const url = process.env.MONGO_URL;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const sessionOption = {
  secret: process.env.SESSION_SECRET || "yadavji06",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  },
};


// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:8080", // Updated to match frontend port
//   credentials: true, // Allow cookies to be sent
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));



// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));



app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  console.log('Current user in session:', req.user);
  next();
});


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));



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
 // sending user data to the frontend
app.get("/current_user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({user:req.user});
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

const moodRoutes = require('./routes/moodRoutes');
app.use('/api/mood', moodRoutes);
const sleepRoutes = require('./routes/sleepRoutes');
app.use('/api/sleep', sleepRoutes);

const quizRoutes = require('./routes/quizRoutes');
app.use('/api/quiz', quizRoutes);

const videoRoutes = require('./routes/videoRoutes');
app.use('/videos', videoRoutes);
app.use('/hub', videoRoutes);


app.post("/appointments", async (req, res) => {
  try {
    console.log(req.body);
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
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

    req.login(registeredUser, (err) => {
      if (err) {
        console.error('Login after signup error:', err);
        return res.status(500).send("Error logging in after registration: " + err.message);
      }
      console.log('User registered and logged in:', req.user);
      res.redirect("https://sih-2025-arogyam.onrender.com/dashboard");
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).send("Error registering user: " + error.message);
  }
});


app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post('/addvolunteer', verifyToken, addVolunteer);

// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       console.error("Authentication error:", err);
//       return res.status(500).json({ message: "Authentication error", error: err.message });
//     }
//     if (!user) {
//       console.log("Login failed: Invalid credentials");
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     req.login(user, (err) => {
//       if (err) {
//         console.error("Login error:", err);
//         return res.status(500).json({ message: "Login error", error: err.message });
//       }

//       console.log("Login successful, user:", req.user);
//      res.redirect("https://sih-2025-arogyam.onrender.com/dashboard");
//     });
//   })(req, res, next);
// });


const volunteerRoutes = require('./routes/volunteer');
app.use('/login/volunteer', volunteerRoutes);

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

const communityRoutes = require('./routes/community');
app.use('/api/community', communityRoutes);


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

// SOCKET.IO starts 
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


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});