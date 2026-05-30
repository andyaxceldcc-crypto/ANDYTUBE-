const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'name profileImage');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploadedBy', 'name profileImage');
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload video (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to upload videos' });
    }

    const { title, description, videoUrl, thumbnail, duration, price } = req.body;

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnail,
      duration,
      price,
      uploadedBy: req.userId
    });

    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update video (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    let video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }

    const { title, description, price } = req.body;
    video.title = title || video.title;
    video.description = description || video.description;
    video.price = price || video.price;
    video.updatedAt = Date.now();

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete video (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const video = await Video.findByIdAndRemove(req.params.id);
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }

    res.json({ msg: 'Video removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
