const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // null indicates broadcast to target role
    },
    targetRole: {
      type: String,
      enum: ['all', 'student', 'admin', 'company'],
      default: 'all'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['event', 'job', 'application', 'registration', 'announcement', 'system'],
      default: 'system'
    },
    link: {
      type: String,
      default: ''
    },
    relatedId: {
      type: String,
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);
