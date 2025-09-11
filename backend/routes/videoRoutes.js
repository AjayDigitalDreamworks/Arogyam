const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Video = require('../models/Hub');

// Set up two separate storages
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'videos',
    resource_type: 'video'
  }
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'thumbnails',
    resource_type: 'image'
  }
});

// Combine storages into fields
const videoUpload = multer({ storage: videoStorage });
const imageUpload = multer({ storage: imageStorage });

// Middleware to handle both uploads
const uploadFiles = [
  videoUpload.single('video'),
  imageUpload.single('thumbnail')
];

// Upload route
router.post('/upload', uploadFiles, async (req, res) => {
  try {
    const { title, category, duration, rating, description, tags } = req.body;

    const videoUrl = req.files?.video?.[0]?.path || req.file?.path;
    const thumbnailUrl = req.files?.thumbnail?.[0]?.path || req.file?.path;

    const video = new Video({
      title,
      category,
      duration,
      rating,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      videoUrl: req?.files?.video?.[0]?.path || req?.file?.path,
      thumbnailUrl: req?.files?.thumbnail?.[0]?.path || req?.file?.path
    });

    await video.save();
    res.status(201).json({ message: 'Upload successful', video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});



// View all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    const guides = [];      // Add this if you plan to return guides
    const exercises = [];   // Add this if you plan to return exercises

    res.json({
      videos,
      guides,
      exercises
    });
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Watch video
router.get('/watch/:id', async (req, res) => {
  const video = await Video.findById(req.params.id);
  res.render('watch', { video });
});

module.exports = router;
