const Job = require('../models/Job');
const CompanyProfile = require('../models/CompanyProfile');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');

// @desc    Get all jobs with search and filter
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      jobType,
      company,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'active' };

    // Search by title or skills or companyName
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skillsRequired: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }

    if (company && company !== 'all') {
      query.companyName = { $regex: company, $options: 'i' };
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'deadline') sortObj = { deadline: 1 };
    if (sort === 'popular') sortObj = { applicantCount: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'logo companyName website industry')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job vacancy not found'
      });
    }

    // Check if current logged-in student has already applied
    let hasApplied = false;
    let applicationDetails = null;

    if (req.user && req.user.role === 'student') {
      const app = await JobApplication.findOne({
        job: job._id,
        student: req.user._id
      });
      if (app) {
        hasApplied = true;
        applicationDetails = app;
      }
    }

    res.status(200).json({
      success: true,
      job,
      hasApplied,
      applicationDetails
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create job listing
// @route   POST /api/jobs
// @access  Private (Company, Admin)
exports.createJob = async (req, res, next) => {
  try {
    const jobData = { ...req.body };
    jobData.companyUser = req.user.id;

    if (req.user.role === 'company') {
      const profile = await CompanyProfile.findOne({ user: req.user.id });
      if (profile) {
        jobData.company = profile._id;
        jobData.companyName = profile.companyName;
        jobData.companyLogo = profile.logo;
      }
    }

    // Parse skillsRequired if string
    if (typeof jobData.skillsRequired === 'string') {
      try {
        jobData.skillsRequired = JSON.parse(jobData.skillsRequired);
      } catch (e) {
        jobData.skillsRequired = jobData.skillsRequired.split(',').map((s) => s.trim());
      }
    }

    const job = await Job.create(jobData);

    // Broadcast notification to students
    await Notification.create({
      targetRole: 'student',
      title: 'New Campus Placement / Job Vacancy! 💼',
      message: `${job.companyName} is hiring for the position of "${job.title}". Package: ${job.salaryOrStipend}. Check eligibility and apply!`,
      type: 'job',
      link: `/jobs/${job._id}`,
      relatedId: job._id.toString()
    });

    res.status(201).json({
      success: true,
      message: 'Job opening posted successfully',
      job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id
// @access  Private (Company, Admin)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job vacancy not found'
      });
    }

    // Check ownership if company
    if (req.user.role === 'company' && job.companyUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job listing'
      });
    }

    const updateData = { ...req.body };

    if (typeof updateData.skillsRequired === 'string') {
      try {
        updateData.skillsRequired = JSON.parse(updateData.skillsRequired);
      } catch (e) {
        updateData.skillsRequired = updateData.skillsRequired.split(',').map((s) => s.trim());
      }
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully',
      job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Company, Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job vacancy not found'
      });
    }

    // Check ownership if company
    if (req.user.role === 'company' && job.companyUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job listing'
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    await JobApplication.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job listing and applications removed successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get jobs posted by current recruiter
// @route   GET /api/jobs/company/mine
// @access  Private (Company)
exports.getMyCompanyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ companyUser: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (err) {
    next(err);
  }
};
