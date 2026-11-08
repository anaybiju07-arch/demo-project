const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

// @desc    Get active announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res, next) => {
  try {
    const { category, priority, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'all') query.category = category;
    if (priority && priority !== 'all') query.priority = priority;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Announcement.countDocuments(query);
    const announcements = await Announcement.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: announcements.length,
      total,
      announcements
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create announcement (Admin)
// @route   POST /api/announcements
// @access  Private (Admin)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const announcementData = { ...req.body };
    announcementData.publishedBy = req.user.id;
    announcementData.authorName = req.user.name;

    if (req.file) {
      announcementData.bannerUrl = `/uploads/posters/${req.file.filename}`;
    }

    const announcement = await Announcement.create(announcementData);

    // Send notification
    let targetRole = 'all';
    if (announcement.targetAudience === 'students' || announcement.targetAudience === 'internal_only') {
      targetRole = 'student';
    } else if (announcement.targetAudience === 'companies') {
      targetRole = 'company';
    }

    await Notification.create({
      targetRole,
      title: `Campus Announcement: ${announcement.title}`,
      message: announcement.content.substring(0, 150),
      type: 'announcement',
      link: '/announcements',
      relatedId: announcement._id.toString()
    });

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      announcement
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update announcement (Admin)
// @route   PUT /api/announcements/:id
// @access  Private (Admin)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.bannerUrl = `/uploads/posters/${req.file.filename}`;
    }

    const announcement = await Announcement.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete announcement (Admin)
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
