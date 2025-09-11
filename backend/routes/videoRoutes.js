const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Video = require('../models/Hub');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith('video/')) {
      return {
        folder: 'videos',
        resource_type: 'video'
      };
    } else if (file.mimetype.startsWith('image/')) {
      return {
        folder: 'thumbnails',
        resource_type: 'image'
      };
    } else {
      throw new Error('Unsupported file type');
    }
  }
});

const upload = multer({ storage });

// Middleware to handle both files
const uploadFiles = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

// Render upload form
router.get('/upload', (req, res) => {
  res.render('upload', { msg: "" });
});

// Upload route
router.post('/upload', uploadFiles, async (req, res) => {
  try {
    const { title, category, duration, rating, description, tags } = req.body;

    const videoUrl = req.files?.video?.[0]?.path;
    const thumbnailUrl = req.files?.thumbnail?.[0]?.path;

    const video = new Video({
      title,
      category,
      duration,
      rating,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      videoUrl,
      thumbnailUrl
    });

    await video.save();
    res.status(201).json({ message: 'Upload successful', video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

//  View all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    const guides = [];
    const exercises = [];

    // Optional: use JSON API or render view
    res.json({ videos, guides, exercises });

    // If rendering:
    // res.render('hub', { videos });
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// New API endpoint to return videos as JSON
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
});

// Watch video route
router.get('/watch/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    res.render('watch', { video });
  } catch (err) {
    res.status(404).json({ error: 'Video not found' });
  }
});

module.exports = router;
