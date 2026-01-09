const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
const  CloudinaryStorage  = require('multer-storage-cloudinary');

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
    // res.status(201).json({ message: 'Upload successful', video });
    res.redirect('http://localhost:8080/counsellor/resources');
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

// DELETE a resource (video/guide/exercise) by id
// Note: This endpoint now deletes ONLY the database record and does NOT
// attempt to remove files from Cloudinary. This avoids accidental removal
// of media assets that may be in use elsewhere.
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`DELETE /videos/${id} requested from ${req.ip} - authorization: ${req.headers.authorization || 'none'}`);

    // Defensive: catch cast errors for invalid ObjectId formats
    let resource;
    try {
      resource = await Video.findById(id);
    } catch (castErr) {
      console.warn(`Invalid id format for DELETE /videos/${id}:`, castErr.message);
      return res.status(400).json({ message: 'Invalid resource id format', id });
    }

    if (!resource) {
      console.warn(`Resource not found for id ${id}`);
      return res.status(404).json({ message: 'Resource not found', id });
    }

    // Delete only from database; do not attempt to delete Cloudinary assets.
    await Video.findByIdAndDelete(id);

    console.log(`Resource ${id} deleted from DB`);
    res.json({ message: 'Resource deleted (database only)', id });
  } catch (error) {
    console.error('Failed to delete resource', error);
    res.status(500).json({ message: 'Failed to delete resource', error: error.message });
  }
});

module.exports = router;
