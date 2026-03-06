require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const videoRoutes = require("./routes/videoRoutes");
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
// Run every 5 minutes to check for upcoming appointments within the next 2 hours
// cron.schedule('*/5 * * * *', async () => {
//   try {
//     const now = new Date();
//     const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
//      console.log("hello from cron job", now.toISOString(), twoHoursLater.toISOString());
//     const appointments = await Appointment.find({
//       date: { 
//         $gte: now.toISOString().split('T')[0], 
//         $lte: twoHoursLater.toISOString().split('T')[0] 
//       },
//       status: { $in: ['pending', 'accepted', 'modified'] },
//       reminderSent: { $ne: true }
//     }).populate('userId').populate('counselorId');

//     for (const appt of appointments) {

//       let apptDateTime;

//       if (appt.time && appt.time.length <= 5) {
//         apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
//       } else {
//         apptDateTime = new Date(`${appt.date}T${appt.time}`);
//       }

//       const diff = apptDateTime - now;

//       // Send reminder if appointment is within the next 2 hours
//       if (diff > 0 && diff <= 2 * 60 * 60 * 1000) {

//         const userEmail = appt.userId?.email;

//         if (!userEmail || !userEmail.includes('@')) {
//           console.error(`No valid email found for userId: ${appt.userId?._id}`);
//           continue;
//         }

//         const message = `Reminder: You have an appointment with ${appt.counselorId?.name || 'your counselor'} at ${appt.time} on ${appt.date}.`;

//         try {
//           await transporter.sendMail({
//             from: "arogyam.help01@gmail.com",
//             to: userEmail,
//             subject: "Appointment Reminder",
//             text: message
//           });

//           appt.reminderSent = true;
//           await appt.save();

//           console.log(`Reminder sent to ${userEmail}`);
//         } catch (emailErr) {
//           console.error(`Failed to send reminder to ${userEmail}:`, emailErr);
//         }
//       }
//     }

//   } catch (err) {
//     console.error('Error sending reminders:', err);
//   }
// });




// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {

  try {

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    console.log("Cron Running:", now);

    const appointments = await Appointment.find({
      status: { $in: ["pending", "accepted", "modified"] },
      reminderSent: { $ne: true }
    })
    .populate("userId")
    .populate("counselorId");

    for (const appt of appointments) {

      let apptDateTime;

      if (appt.time && appt.time.length <= 5) {
        apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
      } else {
        apptDateTime = new Date(`${appt.date}T${appt.time}`);
      }

      const diff = apptDateTime - now;

      // Check if appointment is within next 2 hours
      if (diff > 0 && diff <= 2 * 60 * 60 * 1000) {

        const userEmail = appt.userId?.email;

        if (!userEmail || !userEmail.includes("@")) {
          console.log("Invalid Email for user:", appt.userId?._id);
          continue;
        }

        const message = `
Hello,

Reminder: You have an appointment.

Counselor: ${appt.counselorId?.name || "Counselor"}
Date: ${appt.date}
Time: ${appt.time}

Please be available on time.

Team Arogyam
`;

        try {

          await transporter.sendMail({
            from: `"Arogyam Support" <${process.env.EMAIL}>`,
            to: userEmail,
            subject: "Appointment Reminder",
            text: message
          });

          console.log("Reminder sent to:", userEmail);

          appt.reminderSent = true;
          await appt.save();

        } catch (emailErr) {

          console.error("Email send failed:", emailErr);

        }
      }
    }

  } catch (err) {

    console.error("Cron Error:", err);

  }

});












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
    const { counselorId, date, time, userId } = req.body;
    if (!counselorId || !date || !time) return res.status(400).json({ message: 'Missing fields' });

    // Check for existing appointment with same counselor/date/time in pending or accepted state
    const conflict = await Appointment.findOne({ counselorId, date, time, status: { $in: ['pending','accepted','modified'] } });
    if (conflict) {
      return res.status(409).json({ message: 'Selected time slot is already taken. Please choose another time.' });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();

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
