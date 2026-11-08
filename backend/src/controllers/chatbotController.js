const { processQuery } = require('../services/chatbotService');
const ChatbotFAQ = require('../models/ChatbotFAQ');

// @desc    Process user question via AI Chatbot
// @route   POST /api/chatbot/ask
// @access  Public
exports.askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }

    const response = await processQuery(question.trim());

    res.status(200).json({
      success: true,
      query: question,
      ...response
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get popular FAQ prompts & quick buttons
// @route   GET /api/chatbot/faqs
// @access  Public
exports.getFAQs = async (req, res, next) => {
  try {
    const faqs = await ChatbotFAQ.find({ isActive: true })
      .sort({ clickCount: -1 })
      .limit(8);

    const defaultQuickReplies = [
      'What events are happening in our college?',
      'What is the next upcoming event?',
      'Which companies are providing job opportunities?',
      'How can I register for an event?',
      'Are external students allowed to register?',
      'How can I apply for a job?'
    ];

    res.status(200).json({
      success: true,
      faqs,
      quickReplies: defaultQuickReplies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Create FAQ entry
// @route   POST /api/chatbot/faqs
// @access  Private (Admin)
exports.createFAQ = async (req, res, next) => {
  try {
    const faq = await ChatbotFAQ.create(req.body);
    res.status(201).json({
      success: true,
      message: 'FAQ entry added to AI Chatbot knowledge base',
      faq
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Update FAQ entry
// @route   PUT /api/chatbot/faqs/:id
// @access  Private (Admin)
exports.updateFAQ = async (req, res, next) => {
  try {
    const faq = await ChatbotFAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      faq
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Delete FAQ entry
// @route   DELETE /api/chatbot/faqs/:id
// @access  Private (Admin)
exports.deleteFAQ = async (req, res, next) => {
  try {
    await ChatbotFAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
