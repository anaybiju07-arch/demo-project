const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/chatbotController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/ask', askQuestion);
router.get('/faqs', getFAQs);
router.post('/faqs', protect, authorize('admin'), createFAQ);
router.put('/faqs/:id', protect, authorize('admin'), updateFAQ);
router.delete('/faqs/:id', protect, authorize('admin'), deleteFAQ);

module.exports = router;
