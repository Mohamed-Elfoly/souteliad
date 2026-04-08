const express = require('express');
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id', notificationController.markAsRead);

router.post(
  '/',
  authController.restrictTo('admin', 'teacher'),
  notificationController.createNotification
);

module.exports = router;
