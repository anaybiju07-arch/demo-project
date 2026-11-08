const mongoose = require('mongoose');

const StatusHistoryItemSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'],
      required: true
    },
    note: {
      type: String,
      default: ''
    },
    changedBy: {
      type: String,
      default: 'Recruiter'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const JobApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    companyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
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
    cgpa: {
      type: Number,
      default: 8.0
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume PDF is required']
    },
    coverLetter: {
      type: String,
      default: ''
    },
    portfolioUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'],
      default: 'Applied'
    },
    statusHistory: [StatusHistoryItemSchema],
    feedback: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// One student can only apply once to a specific job
JobApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
