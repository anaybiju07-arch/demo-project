const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyCompanyJobs
} = require('../controllers/jobController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/company/mine', protect, authorize('company'), getMyCompanyJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', protect, authorize('company', 'admin'), createJob);
router.put('/:id', protect, authorize('company', 'admin'), updateJob);
router.delete('/:id', protect, authorize('company', 'admin'), deleteJob);

module.exports = router;
