const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an announcement title'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please provide announcement content']
    },
    category: {
      type: String,
      enum: ['academic', 'event', 'placement', 'general', 'urgent'],
      default: 'general'
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'internal_only', 'external_only', 'companies'],
      default: 'all'
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    attachmentUrl: {
      type: String,
      default: ''
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: {
      type: String,
      default: 'Campus Administration'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);
