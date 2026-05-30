const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    
    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.profileImage = profileImage || user.profileImage;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if premium
router.get('/premium/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if premium has expired
    if (user.isPremium && user.premiumExpires < new Date()) {
      user.isPremium = false;
      await user.save();
    }

    res.json({
      isPremium: user.isPremium,
      premiumExpires: user.premiumExpires
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
