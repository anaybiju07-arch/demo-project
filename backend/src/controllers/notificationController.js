const Notification = require('../models/Notification');

// @desc    Get notifications for user
// @route   GET /api/notifications
// @access  Private
exports.getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Fetch personal notifications, role-targeted broadcasts, or global broadcasts
    const notifications = await Notification.find({
      $or: [
        { recipient: userId },
        { recipient: null, targetRole: { $in: ['all', userRole] } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(30);

    // Calculate unread count
    const unreadCount = notifications.filter(
      (n) => (!n.isRead && n.recipient) || (n.recipient === null && !n.readBy.includes(userId))
    ).length;

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipient) {
      notification.isRead = true;
    } else {
      // Broadcast notification
      if (!notification.readBy.includes(req.user.id)) {
        notification.readBy.push(req.user.id);
      }
    }

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Update personal
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });

    // Update broadcasts
    await Notification.updateMany(
      { recipient: null, targetRole: { $in: ['all', userRole] }, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Notification removed'
    });
  } catch (err) {
    next(err);
  }
};
