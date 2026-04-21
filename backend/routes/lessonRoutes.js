const express = require('express');
const lessonController = require('../controllers/lessonController');
const authController = require('../controllers/authController');
const { uploadLessonMedia } = require('../utils/lessonUpload');
const quizRouter = require('./quizRoutes');
const ratingRouter = require('./ratingRoutes');

const router = express.Router({ mergeParams: true });

// Nest quiz and rating routes
router.use('/:lessonId/quizzes', quizRouter);
router.use('/:lessonId/ratings', ratingRouter);

// Public GET routes (no auth required)
router.get('/', lessonController.setFilterObj, lessonController.getAllLessons);
router.get('/:id', lessonController.getLesson);

// Protected mutation routes
router.post(
  '/',
  authController.protect,
  authController.restrictTo('teacher', 'admin'),
  authController.checkPermission('canManageLessons'),
  uploadLessonMedia,
  lessonController.setLevelTeacherIds,
  lessonController.processMediaFields,
  lessonController.createLesson
);

router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('teacher', 'admin'),
  authController.checkPermission('canManageLessons'),
  uploadLessonMedia,
  lessonController.processMediaFields,
  lessonController.updateLesson
);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('teacher', 'admin'),
  authController.checkPermission('canManageLessons'),
  lessonController.deleteLesson
);

module.exports = router;
