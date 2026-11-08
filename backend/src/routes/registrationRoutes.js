const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventParticipants,
  exportEventParticipantsCSV,
  verifyQRCode
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, authorize('student'), getMyRegistrations);
router.post('/verify-qr', protect, authorize('admin'), verifyQRCode);
router.get('/event/:eventId/export', protect, authorize('admin'), exportEventParticipantsCSV);
router.get('/event/:eventId', protect, authorize('admin'), getEventParticipants);
router.post('/:eventId', protect, authorize('student'), registerForEvent);
router.put('/:id/cancel', protect, authorize('student'), cancelRegistration);

module.exports = router;
