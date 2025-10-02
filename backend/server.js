require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const videoRoutes = require("./routes/videoRoutes");
const path = require("path");
const User = require("./models/user");

const authRoutes = require("./routes/authRoutes"); 
const { verifyToken } = require("./middleware/authMiddleware");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const moodRoutes = require('./routes/moodRoutes');
app.use('/api/mood', moodRoutes);
const sleepRoutes = require('./routes/sleepRoutes');
app.use('/api/sleep', sleepRoutes);

const quizRoutes = require('./routes/quizRoutes');
app.use('/api/quiz', quizRoutes);

app.use('/videos', videoRoutes);
app.use('/hub', videoRoutes);

const corsOptions = {
  origin: [
    "http://localhost:8080", // Frontend ka URL (development mein)
    "https://sih-2025-arogyam.onrender.com", // Production ka frontend URL (Render pe)
    "https://sih-2025-arogyam-0cf2.onrender.com" // Dusra Render URL (agar applicable ho)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers like Authorization
  credentials: true // Allow credentials (cookies, Authorization token)
};

// CORS ko globally apply karen
app.use(cors(corsOptions));

// MongoDB connection
const url = process.env.MONGO_URL;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Authentication Routes (login/signup)
app.use("/api/auth", authRoutes);

// Protected Route Example (requires JWT verification)
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You have access to this protected route", user: req.user });
});

// Example of another protected route (fetch user data)

app.get('/current_user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the JWT contains the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});


// Example of another route (appointments)
const Appointment = require("./models/appointment");
app.post("/appointments", verifyToken, async (req, res) => {
 try {
    console.log(req.body);
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
});

// Example of a route to fetch counselors (not protected)
const Counselor = require("./models/counsellor");
app.get("/counselors", async (req, res) => {
  try {
    const counselors = await Counselor.find({});
    res.json(counselors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching counselors", error: error.message });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Socket.io setup (example of a simple real-time feature)
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*", // Modify this to allow specific origins as needed
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  // Example of emitting a message to a room or specific client
  socket.on("send-message", (message) => {
    io.emit("new-message", { message, timestamp: new Date() });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
