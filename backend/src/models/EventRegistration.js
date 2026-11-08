const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentType: {
      type: String,
      enum: ['internal', 'external'],
      default: 'internal'
    },
    studentName: {
      type: String,
      required: true
    },
    studentEmail: {
      type: String,
      required: true
    },
    studentPhone: {
      type: String,
      default: ''
    },
    collegeName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    academicYear: {
      type: String,
      default: '3rd Year'
    },
    rollNumber: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'attended'],
      default: 'confirmed'
    },
    qrCodeDataUrl: {
      type: String,
      default: ''
    },
    checkedInAt: {
      type: Date
    },
    cancellationReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Ensure one user cannot register twice for the same event
EventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);
