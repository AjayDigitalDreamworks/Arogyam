require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const videoRoutes = require("./routes/videoRoutes");
const Notification = require("./models/Notification");
const path = require("path");
const User = require("./models/user");
const Appointment = require("./models/appointment");
const authRoutes = require("./routes/authRoutes"); 
const { verifyToken } = require("./middleware/authMiddleware");
const userRoutes = require('./routes/userRoutes');
const counsellorAuth = require('./routes/counsellorAuth');
const cron = require('node-cron');
const nodemailer = require('nodemailer'); 
const transporter = require("./utils/mailer");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies on incoming requests


const corsOptions = {
  origin: [
    "http://localhost:8080", // Frontend ka URL (development mein)
    "http://localhost:5173", // Vite dev server
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

// chatbot senti

app.use("/api/chat", require("./routes/chat"));

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






//notification routes


// const info = transporter.sendMail({
//   from: "arogyam.help01@gmail.com",
//   to: "autenic123@gmail.com",
//   subject: "Test Email from Arogyam",
//   text: "This is a test email to verify nodemailer setup."
// }, (err, info) => {
//   if (err) {
//     console.error("Test email failed:", err);
//   } else {
//     console.log("Test email sent:", info.response);
//   }
// });



function formatTime12Hour(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes} ${ampm}`;
}

async function sendAppointmentReminders() {
  console.log("Running appointment reminder job at", new Date().toISOString());

  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const today = now.toISOString().split("T")[0];

  const nowTime = formatTime12Hour(now);
  const twoHoursLaterTime = formatTime12Hour(twoHoursLater);

  console.log("Checking appointments between:", nowTime, "and", twoHoursLaterTime);

  try {
    const appointments = await Appointment.find({
      date: today,
      time: { $gte: nowTime, $lte: twoHoursLaterTime },
      status: "accepted",
      reminderSent: false
    })
      .populate("counselorId")
      .populate("userId")
      .exec();

    console.log("Appointments needing reminders:", appointments);

    for (const appt of appointments) {
      const userEmail = appt.email;

      const counselorName = appt.counselorId
        ? appt.counselorId.name
        : "your counselor";

      const apptTime = `${appt.date} at ${appt.time}`;

      const mailOptions = {
        from: "arogyam.help01@gmail.com",
        to: "autenic123@getMaxListeners.com",
        subject: "Upcoming Appointment Reminder",
        text: `This is a reminder for your upcoming appointment with ${counselorName} scheduled on ${apptTime}. Please be prepared and join on time.`
      };

      try {
        await transporter.sendMail(mailOptions);

        console.log("Reminder email sent to:", userEmail);

        appt.reminderSent = true;
        await appt.save();
      } catch (emailErr) {
        console.error("Error sending reminder email:", emailErr);
      }
    }
  } catch (err) {
    console.error("Error fetching appointments for reminders:", err);
  }
}



// Schedule the reminder function to run every 10 minutes
cron.schedule("*/10 * * * * *", sendAppointmentReminders);
    


// mood check routes
async function checkMoodStreak() {

  const users = await User.find();

  const today = new Date().toISOString().split("T")[0];

  console.log("Running mood streak check for users:", users.map(u => u.email));

  for (const user of users) {

    // check inside moodHistory array
    const todayEntry = user.moodHistory.find(
      entry => {
        const entryDate = new Date(entry.date).toISOString().split("T")[0];
        return entryDate === today;
      }
    );

    if (!todayEntry) {

      await Notification.create({
        userId: user._id,
        title: "Streak Alert",
        message: "Update your mood today to maintain your streak!",
        type: "streak"
      });

      console.log(`Notification created for ${user.email}`);

    }
  }
}

cron.schedule("4 20 * * *", checkMoodStreak);

// get notifications
app.get("/notifications/:userId", async (req, res) => {

  const notifications = await Notification
    .find({ userId: req.params.userId })
    .sort({ createdAt: -1 });

  res.json(notifications);

});

// delet notifications
app.delete("/notifications/:id", async (req, res) => {

  await Notification.findByIdAndDelete(req.params.id);

  res.json({ message: "Notification deleted" });

});


// follow up notification

async function createFollowupNotifications() {

  const today = new Date().toISOString().split("T")[0];

  const appointments = await Appointment.find({
    date: today,
    status: "accepted"
  });

  for (const appt of appointments) {

    await Notification.create({
      userId: appt.userId,
      title: "Follow-up Reminder",
      message: `You have a session today at ${appt.time}.`,
      type: "followup"
    });

  }
}

cron.schedule("42 21 * * *", createFollowupNotifications);



// inactive peronalization 

async function checkInactiveMoodUsers() {

  const users = await User.find();

  for (const user of users) {

    const lastMood = user.moodHistory[user.moodHistory.length - 1];

    if (!lastMood) continue;

    const diffDays =
      (new Date() - new Date(lastMood.date)) / (1000 * 60 * 60 * 24);

    if (diffDays >= 3) {

      await Notification.create({
        userId: user._id,
        title: "Wellbeing Reminder",
        message: "You haven't tracked your mood for a few days. Take a moment to check in with yourself.",
        type: "personal"
      });

    }
  }
}

cron.schedule("42 21 * * *", checkInactiveMoodUsers);


// sleep notify

async function checkSleepReminder() {

  const users = await User.find();

  for (const user of users) {

    const today = new Date().toISOString().split("T")[0];

    const sleepEntry = user.sleepHistory.find(
      s => new Date(s.date).toISOString().split("T")[0] === today
    );

    if (!sleepEntry) {

      await Notification.create({
        userId: user._id,
        title: "Sleep Reminder",
        message: "Don't forget to log your sleep for today 😴",
        type: "sleep"
      });

    }

  }

}

cron.schedule("42 21 * * *", checkSleepReminder);



// quiz notify

async function checkQuizReminder() {

  const users = await User.find();

  for (const user of users) {

    const today = new Date().toISOString().split("T")[0];

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

}

cron.schedule("42 21 * * *", checkQuizReminder);




const moodRoutes = require('./routes/moodRoutes');
app.use('/api/mood', moodRoutes);
const sleepRoutes = require('./routes/sleepRoutes');
app.use('/api/sleep', sleepRoutes);

const quizRoutes = require('./routes/quizRoutes');
app.use('/api/quiz', quizRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

app.use('/videos', videoRoutes);
app.use('/hub', videoRoutes);
// Expose user list for counsellor dashboard (public for dev)
app.use('/users', userRoutes);

// Counsellor auth routes
const volunteerRoute = require("./routes/volunteer");
const communityRoute = require("./routes/community.routes");
app.use('/api/counsellor', counsellorAuth);
app.use('/api/volunteer', volunteerRoute);
app.use('/api/community', communityRoute);



// Example of appointment routes (create + query + counsellor responses)

// Create appointment (student request). Prevent double bookings for same counsellor/date/time
app.post("/appointments", verifyToken, async (req, res) => {

  
  try {
    const { counselorId, date, time, type, fullName, email, phone, discussion, userId } = req.body;
    // console.log("Received appointment booking request:", req.body);
    // Validate required fields
    if (!counselorId || !date || !time || !type || !fullName || !email || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // console.log("Received appointment booking request upper :", req.body);

    // Validate date and time format (basic check)
    // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    // if (!dateRegex.test(date)) {
    //   return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    // }
    // if (!timeRegex.test(time)) {
    //   return res.status(400).json({ message: 'Invalid time format. Use HH:mm or HH:mm:ss.' });
    // }

    // Check for existing appointment with same counselor/date/time in pending/accepted/modified state
    const conflict = await Appointment.findOne({ counselorId, date, time, status: { $in: ['pending','accepted','modified'] } });
    // console.log("Conflict check result:", conflict);
    // console.log("Received appointment booking request down :", req.body);
    if (conflict) {
      return res.status(409).json({ message: 'Selected time slot is already taken. Please choose another time.' });
    }

    // Create appointment with relevant fields
    const appointment = new Appointment({
      counselorId,
      date,
      time,
      type,
      fullName,
      email,
      phone,
      discussion,
      userId
    });
    await appointment.save();

    // console.log("Received appointment booking request low :", req.body);

    // If userId is provided, push appointment to user's appointments array
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.appointments.push(appointment._id);
        await user.save();
      }
    }

    res.status(201).json({ message: "Appointment requested successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
});

// Get appointments. If counsellor is authenticated, return their appointments. Otherwise filter by query params
app.get('/appointments', verifyToken, async (req, res) => {
  try {
    let filter = {};
    if (req.user && req.user.role === 'counsellor') {
      filter.counselorId = req.user.userId;
    } else if (req.query.counselorId) {
      filter.counselorId = req.query.counselorId;
    }
    if (req.query.status) filter.status = req.query.status;

    const appts = await Appointment.find(filter).sort({ requestedAt: -1 }).populate('counselorId');
    res.json(appts);
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
});

// GET /appointments/mine for user's own appointments
app.get('/appointments/mine', verifyToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const appts = await Appointment.find({ userId: req.user.userId }).sort({ requestedAt: -1 }).populate('counselorId');
    res.json(appts);
  } catch (err) {
    console.error('Get my appointments error:', err);
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
});

// Counsellor responds to appointment: accept/reject/modify. Only counsellor can perform this.
app.patch('/appointments/:id/respond', verifyToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'counsellor') return res.status(403).json({ message: 'Only counsellors can perform this action' });

    const { id } = req.params;
    const { action, newDate, newTime, note } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // ensure counsellor owns the appointment
    if (String(appointment.counselorId) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized for this appointment' });
    }

    if (action === 'accept') {
      // Check for conflicting accepted appointment
      const conflict = await Appointment.findOne({ counselorId: appointment.counselorId, date: appointment.date, time: appointment.time, status: 'accepted', _id: { $ne: appointment._id } });
      if (conflict) return res.status(409).json({ message: 'This time slot has already been taken.' });

      appointment.status = 'accepted';
      appointment.responseNote = note || '';
      appointment.updatedBy = req.user.userId;
      appointment.updatedByModel = 'Counselor';

    } else if (action === 'reject') {
      appointment.status = 'rejected';
      appointment.responseNote = note || '';
      appointment.updatedBy = req.user.userId;
      appointment.updatedByModel = 'Counselor';

    } else if (action === 'modify') {
      if (!newDate || !newTime) return res.status(400).json({ message: 'newDate and newTime required for modify' });
      // check new slot availability
      const conflict = await Appointment.findOne({ counselorId: appointment.counselorId, date: newDate, time: newTime, status: { $in: ['accepted','pending'] }, _id: { $ne: appointment._id } });
      if (conflict) return res.status(409).json({ message: 'Requested new time conflicts with an existing appointment.' });

      appointment.date = newDate;
      appointment.time = newTime;
      appointment.status = 'modified';
      appointment.responseNote = note || 'Counsellor suggested a new time';
      appointment.updatedBy = req.user.userId;
      appointment.updatedByModel = 'Counselor';
    } else {
      return res.status(400).json({ message: 'Unknown action' });
    }

    await appointment.save();
    res.json({ message: 'Appointment updated', appointment });
  } catch (err) {
    console.error('Error responding to appointment:', err);
    res.status(500).json({ message: 'Failed to update appointment', error: err.message });
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
