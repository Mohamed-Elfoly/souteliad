const express = require('express');
const levelController = require('../controllers/levelController');
const authController = require('../controllers/authController');
const lessonRouter = require('./lessonRoutes');

const router = express.Router();

// Nest lesson routes (GET is public via lessonRouter)
router.use('/:levelId/lessons', lessonRouter);

// Public GET routes (no auth required)
router.get('/', levelController.getAllLevels);
router.get('/with-lessons', levelController.getAllLevelsWithLessons);
router.get('/:id', levelController.getLevel);

// Protected mutation routes
router.post(
  '/',
  authController.protect,
  authController.restrictTo('teacher', 'admin'),
  levelController.setAdminId,
  levelController.createLevel
);

router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('teacher', 'admin'),
  levelController.updateLevel
);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('teacher', 'admin'),
  levelController.deleteLevel
);

module.exports = router;
