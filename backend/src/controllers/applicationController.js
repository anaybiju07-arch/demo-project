const crypto = require('crypto');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');

// Helper to generate application ID
const generateAppId = () => {
  const year = new Date().getFullYear();
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SC-APP-${year}-${randomStr}`;
};

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Student)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found'
      });
    }

    // Check deadline
    if (job.status !== 'active' || (job.deadline && new Date() > new Date(job.deadline))) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed or this job opening is closed.'
      });
    }

    // Check if student already applied
    const existingApp = await JobApplication.findOne({
      job: jobId,
      student: studentId
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job opening.',
        application: existingApp
      });
    }

    // Get student profile
    const profile = await StudentProfile.findOne({ user: studentId });

    // Resume handling: either uploaded directly in form or retrieved from profile
    let resumeUrl = req.body.resumeUrl || (profile ? profile.resumeUrl : '');
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
      // Also update student profile with latest resume
      if (profile) {
        profile.resumeUrl = resumeUrl;
        profile.resumeOriginalName = req.file.originalname;
        await profile.save();
      }
    }

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Resume PDF is required to submit job application.'
      });
    }

    const applicationId = generateAppId();

    const application = await JobApplication.create({
      applicationId,
      job: job._id,
      companyUser: job.companyUser,
      student: studentId,
      fullName: req.body.fullName || req.user.name,
      email: req.body.email || req.user.email,
      phone: req.body.phone || (profile ? profile.phone : req.user.phone),
      collegeName: req.body.collegeName || (profile ? profile.collegeName : 'Smart Campus'),
      department: req.body.department || (profile ? profile.department : 'Computer Science'),
      academicYear: req.body.academicYear || (profile ? profile.academicYear : '3rd Year'),
      cgpa: req.body.cgpa ? Number(req.body.cgpa) : profile ? profile.cgpa : 8.0,
      resumeUrl,
      coverLetter: req.body.coverLetter || '',
      portfolioUrl: req.body.portfolioUrl || (profile ? profile.github : ''),
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          note: 'Application submitted successfully',
          changedBy: 'Student',
          updatedAt: new Date()
        }
      ]
    });

    // Increment job applicant count
    job.applicantCount += 1;
    await job.save({ validateBeforeSave: false });

    // Notify student
    await Notification.create({
      recipient: studentId,
      title: 'Job Application Submitted! 🚀',
      message: `Your application for "${job.title}" at ${job.companyName} has been received. Application ID: ${applicationId}.`,
      type: 'application',
      link: '/my-applications',
      relatedId: application._id.toString()
    });

    // Notify recruiter
    await Notification.create({
      recipient: job.companyUser,
      title: 'New Applicant Received! 📄',
      message: `${req.user.name} applied for "${job.title}". Review their profile and resume.`,
      type: 'application',
      link: `/company/jobs/${job._id}/applicants`,
      relatedId: application._id.toString()
    });

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully!',
      application
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ student: req.user.id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applicants for a specific job (Company or Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private (Company, Admin)
exports.getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, search } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership if company
    if (req.user.role === 'company' && job.companyUser.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to job applicants' });
    }

    const query = { job: jobId };
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } }
      ];
    }

    const applicants = await JobApplication.find(query)
      .populate('student', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applicants.length,
      job,
      applicants
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status (Company or Admin)
// @route   PUT /api/applications/:id/status
// @access  Private (Company, Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note, feedback } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await JobApplication.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify company authorization
    if (req.user.role === 'company' && application.companyUser.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to manage this application' });
    }

    // Push to status history
    application.status = status;
    if (feedback) application.feedback = feedback;

    application.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
      changedBy: req.user.role === 'admin' ? 'Campus Placement Admin' : 'Company Recruiter',
      updatedAt: new Date()
    });

    await application.save();

    // Send notification to student
    let statusEmoji = '📝';
    if (status === 'Shortlisted') statusEmoji = '🌟';
    if (status === 'Selected') statusEmoji = '🎉';
    if (status === 'Rejected') statusEmoji = 'ℹ️';

    await Notification.create({
      recipient: application.student,
      title: `${statusEmoji} Application Update: ${application.job.title}`,
      message: `Your application status for "${application.job.title}" at ${application.job.companyName} is now: ${status}. ${note || ''}`,
      type: 'application',
      link: '/my-applications',
      relatedId: application._id.toString()
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application
    });
  } catch (err) {
    next(err);
  }
};
