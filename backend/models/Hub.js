const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  category: String,
  duration: String,
  rating: Number,
  description: String,
  tags: [String],
  videoUrl: String,
  thumbnailUrl: String   // 👈 New Field
});

module.exports = mongoose.model('Video', videoSchema);
