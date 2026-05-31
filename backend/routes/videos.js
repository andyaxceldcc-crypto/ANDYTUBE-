const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'name profileImage').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('Get videos error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploadedBy', 'name profileImage');
    if (!video) {
      return res.status(404).json({ msg: 'Video no encontrado' });
    }
    res.json(video);
  } catch (err) {
    console.error('Get video error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Upload video (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'No autorizado para subir videos' });
    }

    const { title, description, videoUrl, thumbnail, duration, price } = req.body;

    if (!title || !description || !videoUrl || !thumbnail || !duration || !price) {
      return res.status(400).json({ msg: 'Todos los campos son requeridos' });
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnail,
      duration: parseInt(duration),
      price: parseFloat(price),
      uploadedBy: req.userId
    });

    await video.save();
    res.status(201).json(video);
  } catch (err) {
    console.error('Upload video error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update video (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user?.isAdmin) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    let video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ msg: 'Video no encontrado' });
    }

    const { title, description, price } = req.body;
    video.title = title || video.title;
    video.description = description || video.description;
    video.price = price || video.price;
    video.updatedAt = Date.now();

    await video.save();
    res.json(video);
  } catch (err) {
    console.error('Update video error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete video (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user?.isAdmin) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ msg: 'Video no encontrado' });
    }

    res.json({ msg: '✅ Video eliminado' });
  } catch (err) {
    console.error('Delete video error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
