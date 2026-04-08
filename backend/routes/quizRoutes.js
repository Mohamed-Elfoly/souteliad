const express = require('express');
const quizController = require('../controllers/quizController');
const authController = require('../controllers/authController');
const questionRouter = require('./questionRoutes');

const router = express.Router({ mergeParams: true });

// Nest question routes
router.use('/:quizId/questions', questionRouter);

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  .get(quizController.setFilterObj, quizController.getAllQuizzes)
  .post(
    authController.restrictTo('teacher', 'admin'),
    quizController.setLessonTeacherIds,
    quizController.createQuiz
  );

router
  .route('/:id')
  .get(quizController.getQuiz)
  .patch(
    authController.restrictTo('teacher', 'admin'),
    quizController.updateQuiz
  )
  .delete(
    authController.restrictTo('teacher', 'admin'),
    quizController.deleteQuiz
  );

module.exports = router;
