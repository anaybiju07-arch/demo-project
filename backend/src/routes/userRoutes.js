const express = require('express');
const router = express.Router();
const {
  updateStudentProfile,
  updateCompanyProfile,
  uploadAvatar,
  uploadResume
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/student-profile', protect, authorize('student'), updateStudentProfile);
router.put('/company-profile', protect, authorize('company'), updateCompanyProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);

module.exports = router;
