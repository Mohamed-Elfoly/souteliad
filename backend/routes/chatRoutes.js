const express = require('express');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');
const { uploadChatImage } = require('../utils/chatUpload');

const router = express.Router();

router.use(authController.protect);

router.post('/message', uploadChatImage, chatController.sendMessage);
router.get('/history', chatController.getHistory);
router.delete('/history', chatController.clearHistory);

module.exports = router;
