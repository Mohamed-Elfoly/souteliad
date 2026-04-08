const express = require('express');
const lessonProgressController = require('../controllers/lessonProgressController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.post('/', lessonProgressController.markComplete);
router.get('/my-progress', lessonProgressController.getMyProgress);
router.get(
  '/user/:userId',
  authController.restrictTo('teacher', 'admin'),
  lessonProgressController.getUserProgress
);

module.exports = router;
