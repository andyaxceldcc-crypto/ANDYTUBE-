const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false  // Videos externos son gratis por defecto
  },
  // Nuevo: tipo de fuente del video
  sourceType: {
    type: String,
    enum: ['upload', 'youtube', 'tiktok', 'facebook', 'vimeo', 'external'],
    default: 'upload'
  },
  // Para videos externos
  externalId: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  // ¿Es video gratuito para todos?
  isFree: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-detectar tipo de fuente
videoSchema.pre('save', function(next) {
  const url = this.videoUrl || '';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    this.sourceType = 'youtube';
    this.isFree = true; // YouTube es gratis
  } else if (url.includes('tiktok.com')) {
    this.sourceType = 'tiktok';
    this.isFree = true;
  } else if (url.includes('facebook.com')) {
    this.sourceType = 'facebook';
    this.isFree = true;
  } else if (url.includes('vimeo.com')) {
    this.sourceType = 'vimeo';
    this.isFree = true;
  } else if (url.startsWith('http')) {
    this.sourceType = 'external';
    this.isFree = true;
  } else {
    this.sourceType = 'upload';
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Video', videoSchema);
