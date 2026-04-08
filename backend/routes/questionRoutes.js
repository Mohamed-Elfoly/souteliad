const express = require('express');
const questionController = require('../controllers/questionController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  .get(questionController.setFilterObj, questionController.getAllQuestions)
  .post(
    authController.restrictTo('teacher', 'admin'),
    questionController.setQuizId,
    questionController.createQuestion
  );

router
  .route('/:id')
  .get(questionController.getQuestion)
  .patch(
    authController.restrictTo('teacher', 'admin'),
    questionController.updateQuestion
  )
  .delete(
    authController.restrictTo('teacher', 'admin'),
    questionController.deleteQuestion
  );

module.exports = router;
