const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('company', 'admin'), getJobApplicants);
router.post('/:jobId', protect, authorize('student'), upload.single('resume'), applyForJob);
router.put('/:id/status', protect, authorize('company', 'admin'), updateApplicationStatus);

module.exports = router;
