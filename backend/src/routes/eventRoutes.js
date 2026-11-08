const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents
} = require('../controllers/eventController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/:id', optionalAuth, getEventById);
router.post('/', protect, authorize('admin'), upload.single('poster'), createEvent);
router.put('/:id', protect, authorize('admin'), upload.single('poster'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;
