const express = require('express');
const ratingController = require('../controllers/ratingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

// Admin — GET /api/v1/ratings/admin
router.get(
  '/admin',
  authController.restrictTo('admin'),
  ratingController.getAllRatingsAdmin
);

// Student — POST /api/v1/lessons/:lessonId/ratings
router.post('/', ratingController.addRating);

// Student — GET /api/v1/lessons/:lessonId/ratings/me
router.get('/me', ratingController.getMyRating);

module.exports = router;
