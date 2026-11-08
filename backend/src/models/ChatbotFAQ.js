const mongoose = require('mongoose');

const ChatbotFAQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['event', 'job', 'admission', 'campus', 'registration', 'general'],
      default: 'general'
    },
    keywords: {
      type: [String],
      default: []
    },
    suggestedQuickReplies: {
      type: [String],
      default: []
    },
    clickCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ChatbotFAQ', ChatbotFAQSchema);
