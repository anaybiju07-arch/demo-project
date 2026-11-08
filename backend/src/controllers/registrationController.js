const crypto = require('crypto');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');
const { generateQRCodeDataUrl } = require('../services/qrService');

// Helper to generate unique registration ID
const generateRegId = () => {
  const year = new Date().getFullYear();
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SC-REG-${year}-${randomStr}`;
};

// @desc    Register for an event
// @route   POST /api/registrations/:eventId
// @access  Private (Student)
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // 1. Check if event is open for registration
    const now = new Date();
    if (event.status === 'completed' || event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This event is no longer accepting registrations.'
      });
    }

    if (event.regEndDate && now > new Date(event.regEndDate)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed for this event.'
      });
    }

    if (event.regStartDate && now < new Date(event.regStartDate)) {
      return res.status(400).json({
        success: false,
        message: 'Registration has not started yet for this event.'
      });
    }

    // 2. Check participant limit
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Maximum participant capacity has been reached for this event.'
      });
    }

    // 3. Get Student Profile to check eligibility
    const studentProfile = await StudentProfile.findOne({ user: userId });
    const studentType = studentProfile ? studentProfile.studentType : 'internal';

    if (event.eligibility === 'internal_only' && studentType !== 'internal') {
      return res.status(403).json({
        success: false,
        message: 'This event is exclusively open to internal host college students.'
      });
    }

    if (event.eligibility === 'external_only' && studentType !== 'external') {
      return res.status(403).json({
        success: false,
        message: 'This event is exclusively for external college students.'
      });
    }

    // 4. Check for duplicate registration
    const existingReg = await EventRegistration.findOne({
      event: eventId,
      user: userId,
      status: { $ne: 'cancelled' }
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event.',
        registration: existingReg
      });
    }

    // 5. Generate unique Registration ID
    const registrationId = generateRegId();

    // 6. Generate QR Code payload
    const qrPayload = {
      regId: registrationId,
      eventId: event._id,
      eventTitle: event.title,
      studentName: req.user.name,
      studentEmail: req.user.email,
      college: studentProfile ? studentProfile.collegeName : 'Smart Campus',
      date: event.date,
      venue: event.venue
    };

    const qrCodeDataUrl = await generateQRCodeDataUrl(qrPayload);

    // 7. Create registration record
    const registration = await EventRegistration.create({
      registrationId,
      event: event._id,
      user: userId,
      studentType,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentPhone: req.body.phone || (studentProfile ? studentProfile.phone : req.user.phone),
      collegeName: req.body.collegeName || (studentProfile ? studentProfile.collegeName : 'Smart Campus'),
      department: req.body.department || (studentProfile ? studentProfile.department : 'General'),
      academicYear: req.body.academicYear || (studentProfile ? studentProfile.academicYear : '3rd Year'),
      rollNumber: req.body.rollNumber || (studentProfile ? studentProfile.rollNumber : ''),
      qrCodeDataUrl,
      status: 'confirmed'
    });

    // 8. Increment event participant count
    event.currentParticipants += 1;
    await event.save({ validateBeforeSave: false });

    // 9. Send Notification to student
    await Notification.create({
      recipient: userId,
      title: 'Event Registration Confirmed! 🎉',
      message: `Your registration for "${event.title}" is confirmed! Reg ID: ${registrationId}. Download your entry pass with QR code anytime.`,
      type: 'registration',
      link: '/my-registrations',
      relatedId: registration._id.toString()
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event!',
      registration
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel event registration
// @route   PUT /api/registrations/:id/cancel
// @access  Private (Student)
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already cancelled'
      });
    }

    if (registration.status === 'attended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration after event check-in/attendance'
      });
    }

    registration.status = 'cancelled';
    registration.cancellationReason = req.body.reason || 'Cancelled by student';
    await registration.save();

    // Decrement event participant count
    await Event.findByIdAndUpdate(registration.event, {
      $inc: { currentParticipants: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Event registration successfully cancelled',
      registration
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current student's registrations
// @route   GET /api/registrations/my
// @access  Private (Student)
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all participants for an event (Admin)
// @route   GET /api/registrations/event/:eventId
// @access  Private (Admin)
exports.getEventParticipants = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { status, studentType, search } = req.query;

    const query = { event: eventId };
    if (status && status !== 'all') query.status = status;
    if (studentType && studentType !== 'all') query.studentType = studentType;

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { studentEmail: { $regex: search, $options: 'i' } },
        { registrationId: { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } }
      ];
    }

    const participants = await EventRegistration.find(query)
      .populate('user', 'name email avatar phone')
      .sort({ createdAt: -1 });

    const event = await Event.findById(eventId);

    res.status(200).json({
      success: true,
      count: participants.length,
      event,
      participants
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export event participants to CSV
// @route   GET /api/registrations/event/:eventId/export
// @access  Private (Admin)
exports.exportEventParticipantsCSV = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const participants = await EventRegistration.find({ event: eventId }).sort({ createdAt: -1 });

    // Build CSV
    const headers = [
      'Registration ID',
      'Student Name',
      'Email',
      'Phone',
      'Student Type',
      'College Name',
      'Department',
      'Academic Year',
      'Roll Number',
      'Status',
      'Registration Date'
    ];

    const rows = participants.map((p) => [
      `"${p.registrationId}"`,
      `"${p.studentName}"`,
      `"${p.studentEmail}"`,
      `"${p.studentPhone || 'N/A'}"`,
      `"${p.studentType.toUpperCase()}"`,
      `"${p.collegeName}"`,
      `"${p.department}"`,
      `"${p.academicYear}"`,
      `"${p.rollNumber || 'N/A'}"`,
      `"${p.status.toUpperCase()}"`,
      `"${new Date(p.createdAt).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="participants-${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv"`
    );
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};

// @desc    Verify QR code and mark attendance
// @route   POST /api/registrations/verify-qr
// @access  Private (Admin)
exports.verifyQRCode = async (req, res, next) => {
  try {
    const { registrationId } = req.body;

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required'
      });
    }

    const registration = await EventRegistration.findOne({ registrationId })
      .populate('event')
      .populate('user', 'name email avatar');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Invalid pass! No registration record found matching this QR code.'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration pass was previously cancelled.',
        registration
      });
    }

    if (registration.status === 'attended') {
      return res.status(200).json({
        success: true,
        alreadyAttended: true,
        message: `Pass already scanned and checked in at ${new Date(registration.checkedInAt).toLocaleTimeString()}`,
        registration
      });
    }

    // Mark attended
    registration.status = 'attended';
    registration.checkedInAt = new Date();
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'QR Pass successfully verified! Attendance recorded.',
      registration
    });
  } catch (err) {
    next(err);
  }
};
