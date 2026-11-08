const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Announcement = require('../models/Announcement');

// @desc    Get comprehensive admin analytics & statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. Basic Counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const internalStudents = await StudentProfile.countDocuments({ studentType: 'internal' });
    const externalStudents = await StudentProfile.countDocuments({ studentType: 'external' });

    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      status: { $in: ['upcoming', 'ongoing'] },
      date: { $gte: new Date() }
    });

    const totalRegistrations = await EventRegistration.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await JobApplication.countDocuments();

    // 2. Event category breakdown for Charts
    const eventCategoryAgg = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalParticipants: { $sum: '$currentParticipants' } } }
    ]);

    // 3. Application status breakdown for Charts
    const applicationStatusAgg = await JobApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 4. Student distribution by Department
    const departmentAgg = await StudentProfile.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // 5. Recent registrations
    const recentRegistrations = await EventRegistration.find()
      .populate('event', 'title date venue')
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(6);

    // 6. Recent job applications
    const recentApplications = await JobApplication.find()
      .populate('job', 'title companyName')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        internalStudents,
        externalStudents,
        totalCompanies,
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        totalJobs,
        activeJobs,
        totalApplications
      },
      charts: {
        eventCategories: eventCategoryAgg,
        applicationStatuses: applicationStatusAgg,
        departments: departmentAgg
      },
      recentActivity: {
        registrations: recentRegistrations,
        applications: recentApplications
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Get all students with filtering
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getAllStudents = async (req, res, next) => {
  try {
    const { search, studentType, department, page = 1, limit = 20 } = req.query;

    const profileQuery = {};
    if (studentType && studentType !== 'all') profileQuery.studentType = studentType;
    if (department && department !== 'all') profileQuery.department = department;

    if (search) {
      profileQuery.$or = [
        { collegeName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const profiles = await StudentProfile.find(profileQuery)
      .populate('user', 'name email phone avatar createdAt')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await StudentProfile.countDocuments(profileQuery);

    res.status(200).json({
      success: true,
      total,
      count: profiles.length,
      students: profiles
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Get all companies
// @route   GET /api/admin/companies
// @access  Private (Admin)
exports.getAllCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyProfile.find()
      .populate('user', 'name email phone createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Toggle company approval
// @route   PUT /api/admin/companies/:id/approval
// @access  Private (Admin)
exports.toggleCompanyApproval = async (req, res, next) => {
  try {
    const company = await CompanyProfile.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    company.isApproved = !company.isApproved;
    await company.save();

    res.status(200).json({
      success: true,
      message: `Company approval set to ${company.isApproved}`,
      company
    });
  } catch (err) {
    next(err);
  }
};
