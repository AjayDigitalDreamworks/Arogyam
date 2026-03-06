/* =========================
   IMPORTS
========================= */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const cron = require("node-cron");

const transporter = require("./utils/mailer");

/* =========================
   MODELS
========================= */

const User = require("./models/user");
const Appointment = require("./models/appointment");
const Notification = require("./models/Notification");
const Counselor = require("./models/counsellor");

/* =========================
   ROUTES
========================= */

const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const moodRoutes = require("./routes/moodRoutes");
const sleepRoutes = require("./routes/sleepRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const counsellorAuth = require("./routes/counsellorAuth");
const volunteerRoute = require("./routes/volunteer");
const communityRoute = require("./routes/community.routes");

/* =========================
   MIDDLEWARE
========================= */

const { verifyToken } = require("./middleware/authMiddleware");

const app = express();

/* =========================
   VIEW ENGINE
========================= */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =========================
   GLOBAL MIDDLEWARE
========================= */

const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:5173",
    "https://sih-2025-arogyam.onrender.com",
    "https://sih-2025-arogyam-0cf2.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   DATABASE
========================= */

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/chat", require("./routes/chat"));
app.use("/api/mood", moodRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/admin", adminRoutes);
app.use("/users", userRoutes);

app.use("/videos", videoRoutes);
app.use("/hub", videoRoutes);

app.use("/api/counsellor", counsellorAuth);
app.use("/api/volunteer", volunteerRoute);
app.use("/api/community", communityRoute);

/* =========================
   PROTECTED ROUTES
========================= */

app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/current_user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   NOTIFICATION ROUTES
========================= */

app.get("/notifications/:userId", async (req, res) => {
  const notifications = await Notification
    .find({ userId: req.params.userId })
    .sort({ createdAt: -1 });

  res.json(notifications);
});

app.delete("/notifications/:id", async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: "Notification deleted" });
});

/* =========================
   COUNSELORS
========================= */

app.get("/counselors", async (req, res) => {
  try {
    const counselors = await Counselor.find({});
    res.json(counselors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   CRON JOBS
========================= */

// Mood streak reminder
cron.schedule("0 20 * * *", async () => {

  const users = await User.find();
  const today = new Date().toISOString().split("T")[0];

  for (const user of users) {

    const todayEntry = user.moodHistory.find(entry =>
      new Date(entry.date).toISOString().split("T")[0] === today
    );

    if (!todayEntry) {
      await Notification.create({
        userId: user._id,
        title: "Streak Alert",
        message: "Update your mood today to maintain your streak!",
        type: "streak"
      });
    }

  }

});

// Sleep reminder
cron.schedule("0 21 * * *", async () => {

  const users = await User.find();
  const today = new Date().toISOString().split("T")[0];

  for (const user of users) {

    const sleepEntry = user.sleepHistory.find(
      s => new Date(s.date).toISOString().split("T")[0] === today
    );

    if (!sleepEntry) {
      await Notification.create({
        userId: user._id,
        title: "Sleep Reminder",
        message: "Don't forget to log your sleep 😴",
        type: "sleep"
      });
    }

  }

});

// Quiz reminder
cron.schedule("0 17 * * *", async () => {

  const users = await User.find();
  const today = new Date().toISOString().split("T")[0];

  for (const user of users) {

    const quizEntry = user.quizScores.find(
      q => new Date(q.date).toISOString().split("T")[0] === today
    );

    if (!quizEntry) {

      await Notification.create({
        userId: user._id,
        title: "Quiz Reminder",
        message: "Take today's wellness quiz 🧠",
        type: "quiz"
      });

    }

  }

});

/* =========================
   SOCKET.IO
========================= */

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {

  console.log("Client connected");

  socket.on("send-message", (message) => {

    io.emit("new-message", {
      message,
      timestamp: new Date()
    });

  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});