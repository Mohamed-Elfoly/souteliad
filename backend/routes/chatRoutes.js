const express = require('express');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');
const { uploadChatImage } = require('../utils/chatUpload');

const router = express.Router();

router.use(authController.protect);

// Conversations
router.get('/conversations', chatController.getConversations);
router.post('/conversations', chatController.createConversation);
router.delete('/conversations/:id', chatController.deleteConversation);

// Messages within a conversation
router.post('/conversations/:conversationId/message', uploadChatImage, chatController.sendMessage);
router.get('/conversations/:conversationId/history', chatController.getHistory);
router.delete('/conversations/:conversationId/history', chatController.clearHistory);

module.exports = router;
