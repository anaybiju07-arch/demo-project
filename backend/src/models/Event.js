const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide event description']
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: ['seminars', 'workshops', 'technical', 'cultural', 'sports', 'fests', 'other'],
      default: 'technical'
    },
    posterUrl: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date']
    },
    time: {
      type: String,
      required: [true, 'Please provide event time'],
      default: '10:00 AM'
    },
    venue: {
      type: String,
      required: [true, 'Please provide event venue'],
      default: 'Main Auditorium, Campus'
    },
    regStartDate: {
      type: Date,
      default: Date.now
    },
    regEndDate: {
      type: Date,
      required: [true, 'Please provide registration closing date']
    },
    registrationFee: {
      type: Number,
      default: 0
    },
    maxParticipants: {
      type: Number,
      default: 100
    },
    currentParticipants: {
      type: Number,
      default: 0
    },
    eligibility: {
      type: String,
      enum: ['all', 'internal_only', 'external_only'],
      default: 'all'
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      default: 'Computer Science and Engineering'
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    organizerName: {
      type: String,
      default: 'College Event Committee'
    },
    contactEmail: {
      type: String,
      default: 'events@smartcampus.edu'
    },
    contactPhone: {
      type: String,
      default: '+91 98765 43210'
    },
    tags: {
      type: [String],
      default: []
    },
    viewCount: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual to check if registration is closed
EventSchema.virtual('isRegistrationOpen').get(function () {
  const now = new Date();
  if (this.status === 'completed' || this.status === 'cancelled') return false;
  if (this.regEndDate && now > this.regEndDate) return false;
  if (this.regStartDate && now < this.regStartDate) return false;
  if (this.maxParticipants && this.currentParticipants >= this.maxParticipants) return false;
  return true;
});

EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', EventSchema);
