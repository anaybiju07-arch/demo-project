const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');

// @desc    Update student profile
// @route   PUT /api/users/student-profile
// @access  Private (Student)
exports.updateStudentProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      collegeName,
      department,
      course,
      academicYear,
      rollNumber,
      cgpa,
      bio,
      skills,
      linkedin,
      github
    } = req.body;

    // Update user basic info
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (phone) userUpdates.phone = phone;

    const user = await User.findByIdAndUpdate(req.user.id, userUpdates, {
      new: true,
      runValidators: true
    });

    // Update Student Profile
    const profileFields = {
      phone: phone || user.phone,
      collegeName,
      department,
      course,
      academicYear,
      rollNumber,
      cgpa: cgpa ? Number(cgpa) : undefined,
      bio,
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : undefined,
      linkedin,
      github
    };

    // Remove undefined keys
    Object.keys(profileFields).forEach(
      (key) => profileFields[key] === undefined && delete profileFields[key]
    );

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone
      },
      profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update company profile
// @route   PUT /api/users/company-profile
// @access  Private (Company)
exports.updateCompanyProfile = async (req, res, next) => {
  try {
    const {
      companyName,
      industry,
      website,
      contactPerson,
      contactEmail,
      contactPhone,
      location,
      about
    } = req.body;

    const profileFields = {
      companyName,
      industry,
      website,
      contactPerson,
      contactEmail,
      contactPhone,
      location,
      about
    };

    Object.keys(profileFields).forEach(
      (key) => profileFields[key] === undefined && delete profileFields[key]
    );

    const profile = await CompanyProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload avatar / profile photo
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const avatarUrl = `/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    if (user.role === 'company') {
      await CompanyProfile.findOneAndUpdate(
        { user: req.user.id },
        { logo: avatarUrl }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      avatarUrl
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload student resume PDF
// @route   POST /api/users/resume
// @access  Private (Student)
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid PDF resume'
      });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        resumeUrl,
        resumeOriginalName: req.file.originalname
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume PDF uploaded successfully',
      resumeUrl,
      resumeOriginalName: req.file.originalname,
      profile
    });
  } catch (err) {
    next(err);
  }
};
