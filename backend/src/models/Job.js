const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile'
    },
    companyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    requirements: {
      type: String,
      default: ''
    },
    qualifications: {
      type: String,
      required: [true, 'Qualifications are required'],
      default: 'B.Tech / B.E. in CS / IT / ECE or equivalent'
    },
    skillsRequired: {
      type: [String],
      default: []
    },
    jobType: {
      type: String,
      enum: ['full-time', 'internship', 'part-time', 'contract'],
      default: 'full-time'
    },
    salaryOrStipend: {
      type: String,
      required: [true, 'Salary or stipend details are required'],
      default: '₹6,00,000 - ₹10,00,000 / year'
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      default: 'Bengaluru / Hybrid'
    },
    eligibility: {
      type: String,
      default: 'Graduating 2025/2026 Batch, minimum 60% aggregate'
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required']
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active'
    },
    applicantCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Virtual to check if job is open
JobSchema.virtual('isOpen').get(function () {
  const now = new Date();
  if (this.status !== 'active') return false;
  if (this.deadline && now > this.deadline) return false;
  return true;
});

JobSchema.set('toJSON', { virtuals: true });
JobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', JobSchema);
