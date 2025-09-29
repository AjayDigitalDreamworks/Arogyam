const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const Appointment = require("./appointment");

// User schema definition
const UserSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },

  // Authentication


  // Profile
  avatar: {
    type: String,
    default: '🎓'
  },
  university: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: String,
    enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Other']
  },


  // Mood Tracking
  moodHistory: [{
    date: { type: Date, default: Date.now },
    mood: { type: Number, min: 1, max: 5, required: true },
    notes: { type: String, trim: true }
  }],

  // Sleep Tracking
  sleepHistory: [{
    date: { type: Date, default: Date.now },
    hours: { type: Number, min: 0, max: 24, required: true },
    quality: { type: Number, min: 1, max: 5, required: true },
   
  }],

  // Appointments
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  //quiz score
  quizScores: [{
    score: { type: Number, required: true },
    quiz_type: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Apply passport-local-mongoose plugin to UserSchema
UserSchema.plugin(passportLocalMongoose);

// User model creation
const User = mongoose.model("User", UserSchema);
module.exports = User;

// Passport authentication strategies
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());