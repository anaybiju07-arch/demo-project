const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Notification = require('../models/Notification');

// @desc    Get all events with search & filters
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      department,
      status,
      eligibility,
      startDate,
      endDate,
      sort = 'date_asc',
      page = 1,
      limit = 12
    } = req.query;

    const query = { isPublished: true };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Department filter
    if (department && department !== 'all') {
      query.department = department;
    }

    // Eligibility filter
    if (eligibility && eligibility !== 'all') {
      query.eligibility = { $in: [eligibility, 'all'] };
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Sorting
    let sortObj = { date: 1 };
    if (sort === 'date_desc') sortObj = { date: -1 };
    if (sort === 'popular') sortObj = { currentParticipants: -1, viewCount: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments(query);
    const events = await Event.find(query).sort(sortObj).skip(skip).limit(limitNum);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      events
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Increment view count for digital marketing analytics
    event.viewCount += 1;
    await event.save({ validateBeforeSave: false });

    // Check if current user is registered (if auth token provided)
    let isRegistered = false;
    let registrationDetails = null;

    if (req.user) {
      const reg = await EventRegistration.findOne({
        event: event._id,
        user: req.user._id,
        status: { $ne: 'cancelled' }
      });
      if (reg) {
        isRegistered = true;
        registrationDetails = reg;
      }
    }

    res.status(200).json({
      success: true,
      event,
      isRegistered,
      registrationDetails
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
exports.createEvent = async (req, res, next) => {
  try {
    const eventData = { ...req.body };

    // Attach organizer
    eventData.organizer = req.user.id;

    // Handle poster file upload if provided
    if (req.file) {
      eventData.posterUrl = `/uploads/posters/${req.file.filename}`;
    }

    // Process tags
    if (typeof eventData.tags === 'string') {
      try {
        eventData.tags = JSON.parse(eventData.tags);
      } catch (e) {
        eventData.tags = eventData.tags.split(',').map((t) => t.trim());
      }
    }

    const event = await Event.create(eventData);

    // Broadcast notification to students
    await Notification.create({
      targetRole: 'student',
      title: 'New College Event Announced!',
      message: `"${event.title}" has been published by ${event.department}. Registrations are now open!`,
      type: 'event',
      link: `/events/${event._id}`,
      relatedId: event._id.toString()
    });

    res.status(201).json({
      success: true,
      message: 'Event created and published successfully',
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.posterUrl = `/uploads/posters/${req.file.filename}`;
    }

    if (typeof updateData.tags === 'string') {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch (e) {
        updateData.tags = updateData.tags.split(',').map((t) => t.trim());
      }
    }

    // Check if date or venue changed - send notification to registered students!
    const dateChanged = updateData.date && new Date(updateData.date).getTime() !== new Date(event.date).getTime();
    const venueChanged = updateData.venue && updateData.venue !== event.venue;

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (dateChanged || venueChanged) {
      // Find registered students
      const registrations = await EventRegistration.find({
        event: event._id,
        status: 'confirmed'
      });

      for (const reg of registrations) {
        await Notification.create({
          recipient: reg.user,
          title: `Schedule/Venue Update: ${event.title}`,
          message: `The schedule or venue for "${event.title}" has been updated. New venue: ${event.venue}, Date: ${new Date(event.date).toLocaleDateString()} at ${event.time}.`,
          type: 'event',
          link: `/events/${event._id}`
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Also cancel or remove registrations
    await EventRegistration.deleteMany({ event: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured and trending events
// @route   GET /api/events/featured
// @access  Public
exports.getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      status: { $in: ['upcoming', 'ongoing'] },
      isPublished: true
    })
      .sort({ isFeatured: -1, currentParticipants: -1, date: 1 })
      .limit(6);

    res.status(200).json({
      success: true,
      events
    });
  } catch (err) {
    next(err);
  }
};
