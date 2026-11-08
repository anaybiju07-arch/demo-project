const crypto = require('crypto');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const Notification = require('../models/Notification');

// Helper to send token response
const sendTokenResponse = async (user, statusCode, res, extraData = {}) => {
  const token = user.getSignedJwtToken();

  let profile = null;
  if (user.role === 'student') {
    profile = await StudentProfile.findOne({ user: user._id });
  } else if (user.role === 'company') {
    profile = await CompanyProfile.findOne({ user: user._id });
  }

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone
    },
    profile,
    ...extraData
  });
};

// @desc    Register user (Student or Company)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      phone,
      // Student specific fields
      studentType = 'internal',
      collegeName,
      department,
      course,
      academicYear,
      rollNumber,
      // Company specific fields
      companyName,
      industry,
      website,
      location
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || ''
    });

    // Create corresponding profile
    if (role === 'student') {
      const studentCollege =
        studentType === 'internal'
          ? 'Smart Campus Engineering Institute'
          : collegeName || 'Other College / University';

      await StudentProfile.create({
        user: user._id,
        studentType,
        collegeName: studentCollege,
        department: department || 'Computer Science and Engineering',
        course: course || 'B.Tech',
        academicYear: academicYear || '3rd Year',
        rollNumber: rollNumber || '',
        phone: phone || ''
      });

      // Welcome Notification
      await Notification.create({
        recipient: user._id,
        title: 'Welcome to Smart Campus!',
        message: `Welcome ${name}! Explore upcoming college events and active campus recruitment opportunities.`,
        type: 'system',
        link: '/events'
      });
    } else if (role === 'company') {
      await CompanyProfile.create({
        user: user._id,
        companyName: companyName || name,
        industry: industry || 'Technology',
        website: website || '',
        location: location || 'Bengaluru / Remote',
        contactEmail: email,
        contactPerson: name,
        contactPhone: phone || ''
      });

      // Notification
      await Notification.create({
        recipient: user._id,
        title: 'Company Account Registered',
        message: 'Welcome to Smart Campus Recruiter Portal. You can now post vacancies and evaluate applicants.',
        type: 'system',
        link: '/company/post-job'
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'company') {
      profile = await CompanyProfile.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
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

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email address.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // In a production server, send email. For demo/academic project, return resetToken in JSON for testability!
    res.status(200).json({
      success: true,
      message: 'Password reset link simulated. Use reset token to change password.',
      resetToken,
      resetUrl: `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now()}
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, {
      message: 'Password has been successfully updated'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, {
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};
