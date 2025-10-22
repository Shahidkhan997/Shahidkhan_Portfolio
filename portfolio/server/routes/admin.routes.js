const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getMessageStats
} = require('../controllers/admin.controller');

// Apply admin authentication to all admin routes
router.use(adminAuth);

// Get all messages with pagination and filtering
router.get('/messages', getAllMessages);

// Get message statistics
router.get('/messages/stats', getMessageStats);

// Get specific message
router.get('/messages/:id', getMessageById);

// Update message status
router.patch('/messages/:id/status', updateMessageStatus);

// Delete message
router.delete('/messages/:id', deleteMessage);

module.exports = router;
