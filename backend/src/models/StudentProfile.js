const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    studentType: {
      type: String,
      enum: ['internal', 'external'],
      default: 'internal',
      required: true
    },
    collegeName: {
      type: String,
      required: [true, 'College name is required'],
      default: 'Smart Campus Engineering Institute'
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      default: 'Computer Science and Engineering'
    },
    course: {
      type: String,
      default: 'B.Tech'
    },
    academicYear: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni', 'Postgraduate'],
      default: '3rd Year'
    },
    rollNumber: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.5
    },
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    resumeOriginalName: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
