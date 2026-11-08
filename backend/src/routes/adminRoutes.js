const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllStudents,
  getAllCompanies,
  toggleCompanyApproval
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/students', getAllStudents);
router.get('/companies', getAllCompanies);
router.put('/companies/:id/approval', toggleCompanyApproval);

module.exports = router;
